import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../database/prisma";
import Verifikasi from "../../../../services/VerifikasiAkun";

export default async function dapatinSolusi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(401);
        
        const { idsolusi, idsoal, lihat, berdasarkan } = req.body;

        const DataSoal = await prisma.soal.findUnique({
            where: {
                id: idsoal,
            },
            include: {
                pembuat: true,
                favorit: true,
                solusi: {
                    where: {
                        idusername: lihat === "sendiri" ? verifikasi : undefined,
                        id: idsolusi
                    },
                    orderBy: berdasarkan === undefined ? undefined : berdasarkan === "kepintaran" ? { pintar: 'asc' } : { kapan: berdasarkan === "baru" ? 'asc' : 'desc' },
                    include: {
                        user: {
                            select: { username: true }
                        },
                        komentar: {
                            include: {
                                user: {
                                    select: { username: true, gambarurl: true }
                                }
                            }
                        }
                    }
                },
            }
        });

        if(DataSoal === null) return res.status(404).send("Soal tidak ada");

        return res.json({
            profile: DataUser.username,
            idsoal,
            soal: DataSoal,
            suka_ngk: DataSoal.favorit.find((v) => v.iduser === verifikasi) !== undefined,
            ApakahSudahSelesai: DataSoal.solusi.map((v) => v.idusername).includes(verifikasi),
            JumlahSolusi: DataSoal.solusi.filter((v, i, a) => a.findIndex((t) => t.idusername === v.idusername) === i).length,
            solusi: DataSoal.solusi.map((v) => {
                return {
                    ...v,
                    komentar: v.komentar.map((komentar) => {
                        return {
                            ...komentar,
                            apakahSudahVote: JSON.parse(komentar.upvote).includes(verifikasi) ? 'up' : JSON.parse(komentar.downvote).includes(verifikasi) ? 'down' : 'biasa'
                        }
                    }),
                    apakahSudahPintar: JSON.parse(v.pintar).includes(verifikasi)
                }
            })
        });

        
        // const DataKue: { infoakun: string } = parseCookies(req);
        // if(Object.keys(DataKue).length <= 0) {
        //     return res.redirect(401, "Unautherized");
        // }

        // const Infoomasi = await verify(DataKue.infoakun, process.env.SECRET!) as { datanya: {iv: string, IniDataRahasia: string} };
        // const HasilDecrypt: {username: string} = JSON.parse(decrypt(Infoomasi.datanya));

        // const { idsoal, idsolusi } = req.body;
        // const dataUser = (await DapatinSQL('SELECT id FROM users WHERE username = ?', [HasilDecrypt.username]) as any[])[0];

        // let querySolusi = 'SELECT * FROM solusi WHERE idsoal = ?' + (idsolusi !== undefined ? ' AND idsolusi = ?' : '');

        // const dataSolusi = await DapatinSQL(querySolusi, [idsoal].concat(idsolusi !== undefined ? [idsolusi] : [])) as Solusi[];
        // const dataSoal = (await DapatinSQL('SELECT namasoal, level, tags, pembuat, suka FROM soal WHERE idsoal = ?', [idsoal]) as any[])[0];

        // let komentar;
        // if(idsolusi !== undefined) {
        //     komentar = await DapatinSQL('SELECT * FROM komentar WHERE idsolusi = ?', [idsolusi]) as Komentar[];
        //     komentar = komentar.map((v) => {
        //         return {
        //             ...v,
        //             apakahSudahVote: JSON.parse(v.upvote).includes(dataUser.id) ? 'up' : JSON.parse(v.downvote).includes(dataUser.id) ? 'down' : 'biasa'
        //         }
        //     });
        // }

        // if(dataSoal.length <= 0) {
        //     return res.status(404);
        // }
        
        // res.json({
        //     idsoal,
        //     suka_ngk: JSON.parse(dataSoal.suka).includes(dataUser.id),
        //     JumlahSolusi: dataSolusi.length,
        //     komentar,
        //     solusi: dataSolusi.map((v) => {
        //         return {
        //             ...v,
        //             apakahSudahPintar: JSON.parse(v.pintar).includes(dataUser.id)
        //         }
        //     }),
        //     soal: dataSoal
        // })
    } else {
        res.redirect(405, "Method Tidak boleh")
    }
}