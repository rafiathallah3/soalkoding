import { NextApiRequest, NextApiResponse } from "next";
import Verifikasi from "../../../services/VerifikasiAkun";
import { prisma } from "../../../database/prisma";

export default async function dapatinSoal(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const { idsoal } = req.body;

        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(401);

        const DataSoal = await prisma.soal.findUnique({
            where: {
                id: idsoal
            },
            include: {
                pembuat: {
                    select: {
                        username: true
                    }
                },
                kumpulanjawaban: {
                    select: {
                        listjawaban: true,
                        contohjawaban: true,
                        liatankode: true,
                        bahasa: true
                    }
                },
                favorit: true
            }
        });

        
        if(DataSoal === null) return res.status(404).send("Error 404");
        return res.json({
            ...DataSoal,
            suka_ngk: DataSoal.favorit.find((d) => d.iduser === verifikasi) !== undefined
        })
    } else {
        res.status(405).send("Error 405");
    }
}