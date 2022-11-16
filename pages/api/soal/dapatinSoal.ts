import { NextApiRequest, NextApiResponse } from "next";
import Verifikasi from "../../../services/VerifikasiAkun";
import { prisma } from "../../../database/prisma";
import { SemenjakWaktu } from "../../../services/Servis";

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
                favorit: true,
                solusi: {
                    select: {
                        idusername: true
                    }
                },
                diskusi: {
                    select: {
                        id: true,
                        user: {
                            select: { username: true, gambarurl: true },
                        },
                        text: true,
                        bikin: true,
                        downvote: true,
                        upvote: true
                    }
                }
            }
        });

        
        if(DataSoal === null) return res.status(404).send("Error 404");
        return res.json({
            ...DataSoal,
            diskusi: DataSoal.diskusi.map((v) => {
                return {
                    ...v,
                    bikin: SemenjakWaktu(new Date(v.bikin)),
                    apakahSudahVote: JSON.parse(v.upvote).includes(verifikasi) ? "up" : JSON.parse(v.downvote).includes(verifikasi) ? "down" : "biasa"
                }
            }),
            suka_ngk: DataSoal.favorit.find((d) => d.iduser === verifikasi) !== undefined,
            ApakahSudahSelesai: DataSoal.solusi.map((v) => v.idusername).includes(verifikasi)
        })
    } else {
        res.status(405).send("Error 405");
    }
}