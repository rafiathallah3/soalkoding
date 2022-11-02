import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../database/prisma";
import { KirimNotifikasi } from "../../../../services/Servis";
import Verifikasi from "../../../../services/VerifikasiAkun";
import { WarnaStatus } from "../../../../types/tipe";

export default async function HapusSoal(req: NextApiRequest, res: NextApiResponse) {
    const verifikasi = Verifikasi(req, res);
    if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

    const { idsoal } = req.body;

    const DataSoal = await prisma.soal.findFirst({
        where: {
            id: idsoal,
            idpembuat: verifikasi
        }
    });

    if(DataSoal === null) return res.send("Sukses dihapus!");

    await prisma.soal.delete({
        where: {
            id: DataSoal.id
        }
    })

    KirimNotifikasi(WarnaStatus.biru, "Soal sukses dihapus!", { req, res });
    return res.send("Sukses");
}