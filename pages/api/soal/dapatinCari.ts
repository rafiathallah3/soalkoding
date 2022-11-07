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
                solusi: true,
                kumpulanjawaban: {
                    select: {bahasa: true}
                },
                pembuat: {
                    select: {username: true}
                },
                favorit: true
            },
            orderBy: urutan === "baru" ? {
                bikin: 'asc'
            } : urutan === "lama" ? {bikin: 'desc'} : {}
        });

        DataSoal = DataSoal.map((v) => ({
            ...v,
            apakahsudah: v.solusi.find((d) => d.idusername === verifikasi) === undefined ? false:true,
            suka_ngk: v.favorit.find((d) => d.iduser === verifikasi) !== undefined,
            jumlahsolusi: v.solusi.filter((v, i, a) => a.findIndex((t) => t.idusername === v.idusername) === i).length
        }));

        if(kesusahan) {
            DataSoal = DataSoal.filter((v) => kesusahan.split(',').includes(v.level.toString()));
        }
        if(kerjakan) {
            DataSoal = DataSoal.filter((v) => kerjakan === "sudah" ? v.solusi.filter((d) => d.idusername === verifikasi).length > 0 : v.solusi.filter((d) => d.idusername === verifikasi).length <= 0);
        }
        if(tags) {
            DataSoal = DataSoal.filter((v) => tags.split(',').every((j: string) => JSON.parse(v.tags).includes(j)))
        }
        if(bahasa) {
            DataSoal = DataSoal.filter((v) => v.kumpulanjawaban.filter((k) => k.bahasa === bahasa).length > 0)
        }

        const UrutanValid = ["banyakfavorit", "sedikitfavorit", "banyakselesai", "sedikitselesai", "tingkatkepuasan"];
        if(urutan && UrutanValid.includes(urutan)) {
            if(urutan === "banyakfavorit") {
                // DataSoal = DataSoal.filter((v) => )
            }
            // DataSoal = DataSoal.filter(())
        }

        return res.json({kumpulandata: DataSoal});
    }

    return res.status(405).send("Error: 405");
}