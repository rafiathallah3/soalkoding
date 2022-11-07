import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../database/prisma';
import Verifikasi from '../../../../services/VerifikasiAkun';

export default async function Pintar(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(401);

        const { idsoal, idsolusi } = req.body;

        const DapatinPintarSolusi = await prisma.solusi.findUnique({
            where: {
                id: idsolusi
            },
            select: {
                pintar: true
            }
        });

        if(DapatinPintarSolusi === null) return res.status(404).send("Tidak ada");

        const HasilData = !JSON.parse(DapatinPintarSolusi.pintar).includes(verifikasi) ? JSON.parse(DapatinPintarSolusi.pintar).concat([verifikasi]) : JSON.parse(DapatinPintarSolusi.pintar).filter((v: any) => v !== verifikasi);

        await prisma.solusi.update({
            where: {
                id: idsolusi
            },
            data: {
                pintar: JSON.stringify(HasilData)
            }
        })

        res.status(200).json({suka_ngk: HasilData.includes(verifikasi), berapa: HasilData.length, idsolusi});
    } else {
        res.redirect(405, 'Method tidak boleh');
    }
}