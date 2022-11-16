import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../database/prisma";
import { SemenjakWaktu } from "../../../../services/Servis";
import Verifikasi from "../../../../services/VerifikasiAkun";

export default async function dapatinSolusi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const { idsolusi, komentar, tipe, kondisi, idkomen }: { idsolusi: string, komentar: string, tipe: string, kondisi: "up" | "down", idkomen: string } = req.body;
    
        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(401);

        if(tipe === "komen") {
            if(idsolusi === undefined || komentar === undefined) return res.status(404).send("Tidak ketemu");

            await prisma.komentar.create({
                data: {
                    idsolusi,
                    iduser: verifikasi,
                    komen: komentar
                }
            });
            
            const DataKomentar = await prisma.komentar.findMany({
                include: {
                    user: {
                        select: { username: true, gambarurl: true }
                    }
                }
            });
            

            return res.json({
                komentar: DataKomentar.map((v) => ({
                    ...v,
                    bikin: SemenjakWaktu(new Date(v.bikin))
                }))
            });
        } else if(tipe === "vote") {
            if(idkomen === undefined) return res.status(404).send("Tidak ketemu");

            const DataKomen = await prisma.komentar.findUnique({
                where: {
                    id: idkomen
                },
                select: {
                    id: true,
                    upvote: true,
                    downvote: true
                }
            });

            if(DataKomen === null) return res.status(404).send("Tidak ketemu");

            if(kondisi !== undefined && (kondisi === "up" || kondisi === "down")) {
                if(kondisi === "up" && JSON.parse(DataKomen.downvote).includes(verifikasi)) {
                    await prisma.komentar.update({
                        where: {
                            id: DataKomen.id
                        },
                        data: {
                            downvote: JSON.stringify(JSON.parse(DataKomen.downvote).filter((v: any) => v !== verifikasi))
                        }
                    });
                } else if(kondisi === "down" && JSON.parse(DataKomen.upvote).includes(verifikasi)) {
                    await prisma.komentar.update({
                        where: {
                            id: DataKomen.id
                        },
                        data: {
                            upvote: JSON.stringify(JSON.parse(DataKomen.upvote).filter((v: any) => v !== verifikasi))
                        }
                    });
                }

                const TipeKONdisi = {
                    up: "upvote",
                    down: "downvote"
                }

                const Vote = DataKomen[TipeKONdisi[kondisi] as keyof typeof DataKomen] as string;
                const ApakahAda = JSON.parse(Vote).includes(verifikasi); //Cek kalau user sudah vote sesuai variable kondisi
                const Hasil = ApakahAda ? JSON.parse(Vote).filter((v: any) => v !== verifikasi) : JSON.parse(Vote).concat([verifikasi]);
                const UpdateDataKomentar = await prisma.komentar.update({
                    where: { id: DataKomen.id },
                    data: { [TipeKONdisi[kondisi]]: JSON.stringify(Hasil) }
                })

                return res.json({
                    suka: ApakahAda ? "biasa" : kondisi,
                    berapa: JSON.parse(UpdateDataKomentar.upvote).length - JSON.parse(UpdateDataKomentar.downvote).length
                });
            }
        } else if(tipe === "hapus") {
            const DataKomentar = await prisma.komentar.findUnique({
                where: {
                    id: idkomen,
                }
            });

            if(DataKomentar !== null && (DataKomentar.iduser === verifikasi || DataUser.admin || DataUser.moderator)) {
                await prisma.komentar.delete({
                    where: {
                        id: idkomen
                    }
                });
            }

            return res.send("Sukses");
        }
        // const DataKue: { infoakun: string } = parseCookies(req);
        // if(Object.keys(DataKue).length <= 0) {
        //     return res.redirect(401, "Unautherized");
        // }

        // const Infoomasi = await verify(DataKue.infoakun, process.env.SECRET!) as { datanya: {iv: string, IniDataRahasia: string} };
        // const HasilDecrypt: {username: string} = JSON.parse(decrypt(Infoomasi.datanya));
        // const dataUser = (await DapatinSQL('SELECT id FROM users WHERE username = ?', [HasilDecrypt.username]) as any[])[0];

        // const { idsolusi, komentar, tipe, kondisi, idkomen }: { idsolusi: string, komentar: string, tipe: string, kondisi: "up" | "down", idkomen: string } = req.body;

        // if(tipe === "komen") {
        //     if(idsolusi === undefined || komentar === undefined) {
        //         return res.redirect(404, 'Tidak ketemu');
        //     }
    
        //     const DataSolusi = (await DapatinSQL('SELECT komentar FROM solusi WHERE idsolusi = ?', [idsolusi]) as { komentar: string }[])[0];
    
        //     if(DataSolusi === undefined) {
        //         return res.redirect(404, 'Tidak ketemu');
        //     }
            
        //     await DapatinSQL('INSERT INTO komentar (idsolusi, komen, username, bikin, upvote, downvote) VALUES (?, ?, ?, ?, ?, ?)', [idsolusi, komentar.replace(/[\r\n]+/g, '\n'), HasilDecrypt.username, new Date().getTime(), '[]', '[]']);
        //     const dataKomentar = (await DapatinSQL('SELECT * FROM komentar WHERE idsolusi = ?', [idsolusi]) as Komentar[]);
        //     await DapatinSQL('UPDATE solusi SET komentar = ? WHERE idsolusi = ?', [JSON.stringify(dataKomentar.map((v) => v.id)), idsolusi]);
    
        //     return res.json({
        //         komentar: dataKomentar
        //     });
        // } else if(tipe === "vote") {
        //     if(idkomen === undefined) 
        //         return res.redirect(404, 'Tidak ketemu');
            

        //     const DataKomen = (await DapatinSQL('SELECT * FROM komentar WHERE id = ?', [idkomen]) as Komentar[])[0]
        //     if(DataKomen === undefined) 
        //         return res.redirect(404, 'Tidak ketemu');

        //     if(kondisi !== undefined && (kondisi === "up" || kondisi === "down")) {
        //         if(kondisi === "up" && JSON.parse(DataKomen.downvote).includes(dataUser.id)) {
        //             await DapatinSQL('UPDATE komentar SET downvote = ? WHERE id = ?', [JSON.stringify(JSON.parse(DataKomen.downvote).filter((v: any) => v !== dataUser.id)), DataKomen.id])
        //         } else if(kondisi === "down" && JSON.parse(DataKomen.upvote).includes(dataUser.id)) {
        //             await DapatinSQL('UPDATE komentar SET upvote = ? WHERE id = ?', [JSON.stringify(JSON.parse(DataKomen.upvote).filter((v: any) => v !== dataUser.id)), DataKomen.id])
        //         }

        //         const TipeKONdisi = {
        //             up: "upvote",
        //             down: "downvote"
        //         }

        //         const Vote = DataKomen[TipeKONdisi[kondisi] as keyof typeof DataKomen] as string;
        //         const ApakahAda = JSON.parse(Vote).includes(dataUser.id); //Cek kalau user sudah vote sesuai variable kondisi
        //         const Hasil = ApakahAda ? JSON.parse(Vote).filter((v: any) => v !== dataUser.id) : JSON.parse(Vote).concat([dataUser.id]);
        //         await DapatinSQL(`UPDATE komentar SET ${TipeKONdisi[kondisi]} = ? WHERE id = ?`, [JSON.stringify(Hasil), DataKomen.id]);
        //         const UpdateDataKomentar = (await DapatinSQL('SELECT * FROM komentar WHERE id = ?', [DataKomen.id]) as Komentar[])[0];

        //         return res.json({
        //             suka: ApakahAda ? "biasa" : kondisi,
        //             berapa: JSON.parse(UpdateDataKomentar.upvote).length - JSON.parse(UpdateDataKomentar.downvote).length
        //         });
        //     }

        //     return res.redirect(404, 'Tidak ketemu');
        // }

        return res.redirect(404, 'Tidak ketemu');
    } else {
        res.redirect(405, "Method tidak boleh");
    }
}