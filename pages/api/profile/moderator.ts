import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../database/prisma";
import Verifikasi from "../../../services/VerifikasiAkun";

export default async function Moderator(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(401).send("Error: 401");
        if(!DataUser.admin) return res.status(403).send("Sukses jadikan moderator");

        const { username } = req.body;
        const UserJadikanMod = await prisma.akun.findFirst({
            where: {
                username
            }
        });

        if(UserJadikanMod === null) return res.status(404).send("Error: 404");

        const DataModerator = await prisma.akun.update({
            where: {
                id: UserJadikanMod.id
            },
            data: {
                moderator: !UserJadikanMod.moderator
            }
        });

        if(verifikasi !== UserJadikanMod.id) {
            if(DataModerator.moderator) {
                const DataNotifikasi = await prisma.notifikasi.findFirst({
                    where: {
                        iduserKirim: UserJadikanMod.id,
                        tipe: "moderator"
                    }
                });

                if(DataNotifikasi === null) {
                    await prisma.notifikasi.create({
                        data: {
                            link: `/profile/${DataModerator.username}`,
                            konten: "Selamat kamu sekarang menjadi moderator!",
                            iduserDari: verifikasi,
                            iduserKirim: UserJadikanMod.id,
                            tipe: "moderator"
                        }
                    });
    
                    await prisma.akun.update({
                        where: {
                            id: UserJadikanMod.id
                        },
                        data: {
                            jumlahNotif: UserJadikanMod.jumlahNotif + 1
                        }
                    });
                }
            }
        }
        
        return res.send("Sukses");
    }
    
    return res.status(405).send("Error: 405");
}