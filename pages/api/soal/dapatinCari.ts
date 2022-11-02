import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../database/prisma";
import Verifikasi from "../../../services/VerifikasiAkun";

export default async function DapatinCari(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const { kesusahan, kerjakan, urutan, tags, bahasa } = req.body;

        let DataSoal = await prisma.soal.findMany({
            where: {
                public: true,
            },
            include: {
                solusi: true
            },
            orderBy: urutan === "baru" ? {
                bikin: 'asc'
            } : {}
        });

        if(kesusahan) {
            DataSoal = DataSoal.filter((v) => kesusahan.split(',').includes(v.level.toString()));
        }
        if(kerjakan) {
            DataSoal = DataSoal.filter((v) => kerjakan === "sudah" ? v.solusi.filter((d) => d.idusername === verifikasi).length > 0 : v.solusi.filter((d) => d.idusername === verifikasi).length < 0);
        }
        if(urutan) {
            console.log(urutan);
            // DataSoal = DataSoal.filter(())
        }

        console.log(DataSoal);

        return res.status(200).json({s: "s"});
    }

    return res.status(405).send("Error: 405");
}