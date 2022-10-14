import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { PythonShell } from 'python-shell';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import Verifikasi from '../../../../services/VerifikasiAkun';

const apakahSama = `
def ApakahSama(fungsi, parameter, jawaban):
    import json
    try:
        hasil = fungsi(*parameter)
        print(json.dumps({"hasil": str(hasil) if hasil == None else hasil, "jawaban": str(jawaban), "status": "Sukses", "koreksi": jawaban == hasil}))
    except Exception as e:
        import base64
        print(json.dumps({"hasil": base64.b64encode(str(e).encode('utf-8')).decode('utf-8'), "jawaban": jawaban, "status": "Error", "error": e}))
`
export default function KirimJawaban(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        // fs.writeFileSync("D:/Belajar program/belajar_nodejs/soal-koding/code/jalan.py", kode + '\n' + apakahSama + '\n' + listJawaban);
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error: ${verifikasi}`);
        
        const { kode, listJawaban, eksekusiKode }: { kode: string, listJawaban: string, eksekusiKode: string } = req.body;
        // console.log(kode + '\n' + apakahSama + '\n' + listJawaban);
        
        // https://github.com/compiler-explorer/compiler-explorer/blob/main/docs/API.md
        PythonShell.runString(kode + '\n' + apakahSama + '\n' + listJawaban, {mode: "text", pythonOptions: ["-u"]}, (err, hasil: string[] | undefined) => {
            if(err) console.error(err);
            var Hasil: any[] = [];
            
            if(hasil !== undefined) {
                Hasil = hasil.map((v) => JSON.parse(v));
            }

            res.json({data: Hasil});
        });
    } else {
        return res.status(405).send(`Error: 405`);
    }
}