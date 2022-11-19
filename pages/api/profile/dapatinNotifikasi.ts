import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../database/prisma";
import Verifikasi from "../../../services/VerifikasiAkun";

export default async function DapatinNotifikasi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(401);

        const DataNotifikasi = await prisma.notifikasi.findMany({
            where: {
                iduserKirim: verifikasi
            },
            include: {
                userDari: {
                    select: { username: true, gambarurl: true }
                },
                userKirim: {
                    select: { username: true, gambarurl: true }
                }
            }
        });

        await prisma.akun.update({
            where: {
                id: verifikasi
            },
            data: {
                jumlahNotif: 0
            }
        });
        
        return res.json({
            data: DataNotifikasi
        });
    }
}