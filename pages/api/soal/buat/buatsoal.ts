import type { NextApiRequest, NextApiResponse } from 'next';
import { DapatinSQL } from '../../../../database/db';
import { decrypt } from '../../../../database/UbahKeHash';
import jwt from 'jsonwebtoken';
import kuripto from 'crypto';

function parseCookies (request: NextApiRequest) {
    const list: any = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name as keyof typeof list] = decodeURIComponent(value);
    });

    return list;
}

export default async function KirimJawaban(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const { NamaSoal, Level, Tags, Soal } = req.body;
        const id = kuripto.randomBytes(15).toString('hex');

        const DataKue: { infoakun: string } = parseCookies(req);
        const Infoomasi: {email: string, username: string} = JSON.parse(decrypt((jwt.decode(DataKue.infoakun) as any).datanya));

        await DapatinSQL("INSERT INTO soal (namasoal, level, tags, soal, idsoal, pembuat) VALUES (?, ?, ?, ?, ?, ?)", [NamaSoal, Number(Level), Tags.toString(), Soal, id, Infoomasi.username])
        res.json({id})
    } else {
        res.redirect(405, 'Method ini khusus POST');
    }
}