import type { NextApiRequest, NextApiResponse } from 'next';
import Verifikasi from '../../../../services/VerifikasiAkun';
import { prisma } from '../../../../database/prisma';
import { TipeInfoKode } from '../../../../types/tipe';

export default async function BuatSoal(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);
        
        if(Object.values(req.body).every((v) => (v as string).trim() === "")) return res.status(403).send("Error 403");
        // const { NamaSoal, Level, Tags, Soal, ContohJawaban, ListJawaban, Bahasa, LiatanKode, KodeJawaban } = req.body;
        const { namasoal, level, tags, soal, infokode }: { [name: string]: string } = req.body;
        const ParseInfoKode = JSON.parse(infokode) as { [bahasa: string]: TipeInfoKode };

        const data = await prisma.soal.create({
            data: {
                namasoal,
                level: parseInt(level),
                tags,
                soal,
                idpembuat: verifikasi,
                public: false,
                kumpulanjawaban: {
                    createMany: {
                        data: [
                            ...Object.values(ParseInfoKode).filter((v) => v.listjawaban.trim() !== "" || v.contohjawaban.trim() !== "")
                        ]
                    }
                }
            }
        });

        return res.json({ id: data.id });
    }
    
    return res.status(405).send("Error 405");
}