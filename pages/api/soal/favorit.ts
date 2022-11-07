import type { NextApiRequest, NextApiResponse } from 'next';
import Verifikasi from '../../../services/VerifikasiAkun';
import { prisma } from '../../../database/prisma';

export default async function Favorit(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error: ${verifikasi}`);

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(401);

        const { idsoal } = req.body;

        const DapatinSoal = await prisma.soal.findUnique({
            where: {
                id: idsoal
            }
        });

        if(DapatinSoal === null) return res.status(404).send("Soal tidak ketemu");

        const FavoritData = await prisma.favorit.findFirst({
            where: {
                idsoal,
                iduser: verifikasi
            }
        });

        if(FavoritData === null) {
            await prisma.favorit.create({
                data: {
                    iduser: verifikasi,
                    idsoal
                }
            });
        } else {
            await prisma.favorit.delete({
                where: {
                    id: FavoritData.id
                }
            });
        }

        const JumlahData = await prisma.favorit.findMany({
            where: {
                idsoal
            }
        });

        return res.json({ suka_ngk: FavoritData === null, berapa: JumlahData.length })

        // return res.json({ suka_ngk: true, berapa: 1 })

        // const UpdateData = await prisma.soal.update({
        //     where: {
        //         id: idsoal
        //     },
        //     data: {
        //         suka: JSON.stringify(JSON.parse(DapatinSoal.suka).includes(verifikasi) ? JSON.parse(DapatinSoal.suka).filter((v: any) => v !== verifikasi) : JSON.parse(DapatinSoal.suka).concat([verifikasi]))
        //     }
        // });

        // return res.json({ suka_ngk: JSON.parse(UpdateData.suka).includes(verifikasi), berapa: JSON.parse(UpdateData.suka).length });
    }

    return res.redirect(405, 'Method tidak boleh');
}