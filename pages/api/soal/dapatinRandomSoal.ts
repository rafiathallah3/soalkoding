import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../database/prisma";
import Verifikasi from "../../../services/VerifikasiAkun";

export default async function DapatinRandomSoal(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(401);

        const DataSoal = await prisma.soal.findMany({
            where: {
                public: true
            },
            include: {
                pembuat: {
                    select: {
                        username: true
                    }
                },
                solusi: {
                    select: {
                        idusername: true
                    }
                }
            }
        }).then((v) => v.filter(d => d.solusi.filter(x => x.idusername === verifikasi).length <= 0));

        return res.json({
            data: DataSoal[Math.floor(Math.random() * DataSoal.length)]
        });
    }

    return res.status(405).send("Error: 405");
}