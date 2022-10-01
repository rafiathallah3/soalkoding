import type { NextApiRequest, NextApiResponse } from 'next'
import { PythonShell } from 'python-shell';
import { DapatinSQL } from '../../../database/db';
import axios from 'axios';

type DataSoal = {
    namasoal: string,
    level: number,
    tags: string,
    soal: string,
    idsoal: string,
    pembuat: string,
    public: number,
    suka: string,
    listjawaban: string,
    contohjawaban: string
}

const FungsiApakahSama = `
def ApakahSama(fungsi, parameter, jawaban):
    import json
    try:
        hasil = fungsi(*parameter)
        print(json.dumps({"hasil": f"{hasil}", "jawaban": f"{jawaban}", "status": "Sukses", "koreksi": jawaban == hasil}))
    except Exception as e:
        import base64
        print(json.dumps({"hasil": str(e), "jawaban": jawaban, "status": "Error"}))
`

export default async function KirimKode(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const { kode, idsoal, w } = req.body;
        
        const dataMentah = await DapatinSQL('SELECT idsoal, listjawaban, contohjawaban FROM soal WHERE idsoal = ?', [idsoal]) as any[];
        
        if(dataMentah.length <= 0) return res.status(400).json({error: "Soal tidak ketemu"});
        
        const HasilData: DataSoal = dataMentah[0]
        
        PythonShell.runString('import time \nwaktu_mulai = time.time()\n' + kode + '\n' + FungsiApakahSama + '\n' + (w === "test" ? HasilData.contohjawaban : HasilData.listjawaban) + '\n' + 'print(time.time() - waktu_mulai)', {mode: "text", pythonOptions: ["-u"]}, (err, hasil: string[] | undefined) => {
            if(err) console.error(err);
            if(hasil !== undefined) {
                const FilterHasil = hasil.filter((v, i) => {
                    return i !== hasil.length -1;
                });
                console.log(FilterHasil[0])
                const MapData = FilterHasil.map((v) => JSON.parse(v));
                
                res.json({data: MapData, lulus: MapData.filter((v) => v.koreksi).length, gagal: MapData.filter((v) => !v.koreksi).length, waktu: hasil.at(-1)})
            } else {
                res.json({});
            }
        })
    }
}

// export default async function KirimKode(req: NextApiRequest, res: NextApiResponse) {
//     const { kode, idBahasaProgram } = req.body;

//     const optionsKode = {
//         method: 'POST',
//         url: 'https://judge0-ce.p.rapidapi.com/submissions',
//         params: {base64_encoded: 'true', fields: '*'},
//         headers: {
//           'content-type': 'application/json',
//           'Content-Type': 'application/json',
//           'X-RapidAPI-Key': 'f38f691e55msh0fe8fe0664c2f93p19b9cfjsn7089cc25781e',
//           'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
//         },
//         data: JSON.stringify({
//             language_id: idBahasaProgram,
//             source_code: btoa(kode)
//         })
//     };

    
//     const hasilData = await axios.request(optionsKode).then(d => d.data);
    
//     const optionsDecode = {
//         method: 'GET',
//         url: `https://judge0-ce.p.rapidapi.com/submissions/${hasilData.token}`,
//         params: {base64_encoded: true, fields: '*'},
//         headers: {
//             'X-RapidAPI-Key': 'f38f691e55msh0fe8fe0664c2f93p19b9cfjsn7089cc25781e',
//             'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
//         }
//     }

//     const hasilDecode = await axios.request(optionsDecode).then(d => d.data);
//     console.log(hasilDecode);
    
//     const error = hasilDecode.compile_output === null ? hasilDecode.stderr : hasilDecode.compile_output;
//     if(error !== null) {
//         return res.status(200).json({
//             status: "Error",
//             error: new Buffer(error.replace("\n", ""), 'base64').toString('utf-8'),
//             waktu: hasilDecode.time
//         })
//     }

//     let ListOutput: {koreksi: string, hasil: string, jawaban: string, status: "Sukses" | "Error"}[] = [];
//     let nilaiLulus = {gagal: 0, lulus: 0};
//     console.log(new Buffer(hasilDecode.stdout, 'base64').toString("utf-8"))
//     for(const i of new Buffer(hasilDecode.stdout, 'base64').toString('utf-8').split('\n')) {
//         if(i !== "") {
//             const hasilJson: {hasil: any, jawaban: any, status: "Sukses" | "Error"} = JSON.parse(i.replaceAll('\'', "\""));
//             let koreksi: "gagal" | "lulus" = "gagal";

//             if((hasilJson.jawaban instanceof Array && JSON.stringify(hasilJson.hasil) === JSON.stringify(hasilJson.jawaban)) || (hasilJson.hasil === hasilJson.jawaban)) {
//                 koreksi = "lulus"
//             }

//             nilaiLulus[koreksi]++;
//             ListOutput.push({...hasilJson, koreksi, status: hasilJson.status})
//         }
//     }

//     console.log(ListOutput);

//     return res.status(200).json({
//         status: "Sukses",
//         output: ListOutput,
//         waktu: hasilDecode.time,
//         ...nilaiLulus
//     })
// }