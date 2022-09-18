import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { PythonShell } from 'python-shell';

export default function KirimJawaban(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const { kode, listJawaban, eksekusiKode }: { kode: string, listJawaban: string, eksekusiKode: string } = req.body;
        
        let apakahSama = `
def ApakahSama(fungsi, parameter, jawaban):
    import json
    try:
        hasil = fungsi(*parameter)
        print(json.dumps({"hasil": str(hasil) if hasil == None else hasil, "jawaban": jawaban, "status": "Sukses", "koreksi": jawaban == hasil}))
    except Exception as e:
        import base64
        print(json.dumps({"hasil": base64.b64encode(str(e).encode('utf-8')).decode('utf-8'), "jawaban": jawaban, "status": "Error", "error": e}))
        `
        // fs.writeFileSync("D:/Belajar program/belajar_nodejs/soal-koding/code/jalan.py", kode + '\n' + apakahSama + '\n' + listJawaban);
        
        console.log(kode + '\n' + apakahSama + '\n' + listJawaban);
        
        PythonShell.runString(kode + '\n' + apakahSama + '\n' + listJawaban, {mode: "text", pythonOptions: ["-u"]}, (err, hasil: string[] | undefined) => {
            if(err) console.error(err);
            var Hasil: any[] = [];
            
            if(hasil !== undefined) {
                Hasil = hasil.map((v) => JSON.parse(v));
                console.log(Hasil)
            }

            res.json({data: Hasil});
        });
    } else {
        res.redirect(405, 'Method not allowed');
    }
}