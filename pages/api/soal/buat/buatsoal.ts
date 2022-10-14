import type { NextApiRequest, NextApiResponse } from 'next';
import { DapatinSQL, parseCookies } from '../../../../database/db';
import { decrypt } from '../../../../database/UbahKeHash';
import jwt from 'jsonwebtoken';
import kuripto from 'crypto';
import Verifikasi from '../../../../services/VerifikasiAkun';
import { prisma } from '../../../../database/prisma';

export default async function BuatSoal(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const { NamaSoal, Level, Tags, Soal, ContohJawaban, ListJawaban } = req.body;
        
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const data = await prisma.soal.create({
            data: {
                namasoal: NamaSoal,
                level: Level,
                tags: Tags,
                soal: Soal,
                idpembuat: verifikasi,
                contohjawaban: ContohJawaban,
                listjawaban: ListJawaban,
                public: false
            }
        });

        res.status(200).json({ id: data.id });
        // const id = kuripto.randomBytes(15).toString('hex');

        // const DataKue: { infoakun: string } = parseCookies(req);
        // const Infoomasi: {email: string, username: string} = JSON.parse(decrypt((jwt.decode(DataKue.infoakun) as any).datanya));

        // await DapatinSQL("INSERT INTO soal (namasoal, level, tags, soal, idsoal, pembuat) VALUES (?, ?, ?, ?, ?, ?)", [NamaSoal, Number(Level), Tags.toString(), Soal, id, Infoomasi.username])
        // res.json({id})
    } else {
        res.status(405).send("Error 405");
    }
}