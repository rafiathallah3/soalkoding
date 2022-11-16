import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../database/prisma";
import Verifikasi from "../../../services/VerifikasiAkun";

export default async function BuatDiskusi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const { idsoal, iddiskusi, status, text, tipe } = req.body;

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(403).send("Error: 403");

        const DataSoal = await prisma.soal.findUnique({
            where: {
                id: idsoal
            }
        });

        if(DataSoal === null) return res.status(404).send("Error: 404");

        if(tipe === "buat") {
            if(text === undefined) return res.status(400).send("Error: 400");
            await prisma.diskusi.create({
                data: {
                    iduser: verifikasi,
                    idsoal,
                    text
                }
            });
            return res.send("Sukses");
        }
        
        const DataDiskusi = await prisma.diskusi.findUnique({
            where: {
                id: iddiskusi
            }
        });

        if(DataDiskusi === null) return res.status(404).send("Error: 404");

        if(tipe === "vote") {
            if(status === "up" && JSON.parse(DataDiskusi.downvote).includes(verifikasi)) {
                await prisma.diskusi.update({
                    where: {
                        id: DataDiskusi.id
                    },
                    data: {
                        downvote: JSON.stringify(JSON.parse(DataDiskusi.downvote).filter((v: any) => v !== verifikasi))
                    }
                });
            } else if(status === "down" && JSON.parse(DataDiskusi.upvote).includes(verifikasi)) {
                await prisma.diskusi.update({
                    where: {
                        id: DataDiskusi.id
                    },
                    data: {
                        upvote: JSON.stringify(JSON.parse(DataDiskusi.upvote).filter((v: any) => v !== verifikasi))
                    }
                });
            }

            const TipeKONdisi = {
                up: "upvote",
                down: "downvote"
            }

            const Vote = DataDiskusi[TipeKONdisi[status as "up" | "down"] as keyof typeof DataDiskusi] as string;
            const ApakahAda = JSON.parse(Vote).includes(verifikasi); //Cek kalau user sudah vote sesuai variable status
            const Hasil = ApakahAda ? JSON.parse(Vote).filter((v: any) => v !== verifikasi) : JSON.parse(Vote).concat([verifikasi]);
            const UpdateDataDiskusi = await prisma.diskusi.update({
                where: { id: DataDiskusi.id },
                data: { [TipeKONdisi[status as "up" | "down"]]: JSON.stringify(Hasil) }
            })

            return res.json({
                suka: ApakahAda ? "biasa" : status,
                berapa: JSON.parse(UpdateDataDiskusi.upvote).length - JSON.parse(UpdateDataDiskusi.downvote).length
            });
        }

        if(tipe === "hapus" && (DataDiskusi.iduser === verifikasi || DataUser.moderator || DataUser.admin)) {
            await prisma.diskusi.delete({
                where: {
                    id: DataDiskusi.id
                }
            });

            return res.send("Sukses");
        }
    }

    return res.status(405).send("Error: 405");
}