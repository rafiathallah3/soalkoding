import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { DapatinSQL, parseCookies } from "../../../database/db";
import { prisma } from "../../../database/prisma";
import { decrypt } from "../../../database/UbahKeHash";
import { verify } from '../../../services/jwt_sign';
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
                    githuburl: true,
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
                    githuburl: true,
                }
            });

            return res.json({
                ...DataUser,
            })
        }

        return res.status(401);
        // if(nama !== undefined) {
        //     const dataUser = (await DapatinSQL('SELECT username, nama, soalselesai, bio, tinggal, githuburl, bikin FROM users WHERE username = ?', [nama]) as any[])[0];
    
        //     if(dataUser === undefined) {
        //         return res.redirect(200, "Tidak ketemu");
        //     } 
    
        //     let soalSelesai: { namasoal: string, url: string, level: number, kapan: number }[] = [];
        //     const dataSoal = (await DapatinSQL('SELECT idsoal, namasoal, level FROM soal') as { idsoal: string, namasoal: string, level: number }[]);
        //     for(const s of JSON.parse(dataUser.soalselesai) as { idsoal: string, kapan: number }[]) {
        //         const HasilDataSoal = dataSoal.filter((v) => v.idsoal === s.idsoal)[0];
        //         soalSelesai.push({
        //             namasoal: HasilDataSoal.namasoal,
        //             url: `/soal/${s.idsoal}/latihan`,
        //             level: HasilDataSoal.level,
        //             kapan: s.kapan,
        //         })
        //     }
    
        //     return res.json({
        //         ...dataUser,
        //         soalselesai: soalSelesai
        //     });
        // }
         
        // const DataKue: { infoakun: string } = parseCookies(req);
        // if(Object.keys(DataKue).length > 0) {
        //     const Infoomasi = await verify(DataKue.infoakun, process.env.SECRET!) as { datanya: {iv: string, IniDataRahasia: string} };
        //     const HasilDecrypt: {username: string} = JSON.parse(decrypt(Infoomasi.datanya));
        //     const dataUser = (await DapatinSQL('SELECT username, nama, soalselesai, bio, tinggal, githuburl, bikin FROM users WHERE username = ?', [HasilDecrypt.username]) as any[])[0];

        //     return res.json({test: "test"});
        // }
    } else {
        res.redirect(405, "Method tidak boleh");
    }
}