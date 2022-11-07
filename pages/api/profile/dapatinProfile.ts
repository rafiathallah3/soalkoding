import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../database/prisma";
import Verifikasi from "../../../services/VerifikasiAkun";

export default async function dapatinProfile(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const { nama } = req.body;

        if(nama !== undefined) {
            const DataUser = await prisma.akun.findFirst({
                where: {
                    username: nama
                },
                select: {
                    username: true,
                    nama: true,
                    bio: true,
                    tinggal: true,
                    terminate: true,
                    bikin: true,
                    gambarurl: true,
                    website: true,
                    sudahVerifikasi: true,
                    soalselesai: {
                        select: {
                            id: true,
                            soal: {
                                select: {
                                    id: true,
                                    namasoal: true,
                                    level: true
                                }
                            },
                            kapan: true,
                            bahasa: true,
                        }
                    },
                    akungithub: {
                        select: {
                            username: true
                        }
                    },
                    favorit: {
                        include: {
                            soal: {
                                select: {
                                    namasoal: true
                                }
                            }
                        }
                    }
                }
            });

            if(DataUser === null) return res.redirect(404, "Tidak ketemu");
            return res.status(200).json({
                ...DataUser
            });
        }

        const KueInfoAkun = getCookie('infoakun', { req, res });
        if(KueInfoAkun) {
            const verifikasi = Verifikasi(req, res);
            if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);
            
            const DataUser = await prisma.akun.findUnique({
                where: {
                    id: verifikasi
                },
                select: {
                    email: true,
                    username: true,
                    nama: true,
                    bio: true,
                    tinggal: true,
                    akungithub: {
                        select: {
                            username: true
                        }
                    },
                }
            });
            
            return res.json({
                ...DataUser,
            })
        }

        return res.status(401).send("Error 401");
    } else {
        res.redirect(405, "Method tidak boleh");
    }
}