import type { NextApiRequest, NextApiResponse } from 'next';
import kuripto from 'crypto';

export default async function KirimJawaban(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const { NamaSoal, Level, Tags, Soal } = req.body;
        const id = kuripto.randomBytes(15).toString('hex');
        res.json({id})
    } else {
        res.redirect(405, 'Method ini khusus POST');
    }
}