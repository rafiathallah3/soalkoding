import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../database/prisma';
import { JalaninKompiler } from '../../../services/Servis';
import Verifikasi from '../../../services/VerifikasiAkun';

export default async function KirimSolusi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error: ${verifikasi}`);

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(401);
        
        const { kode, idsoal, bahasa } = req.body;
        if(kode === undefined || idsoal === undefined) return res.status(403).send("Error: 403");

        const DataSoal = await prisma.soal.findUnique({
            where: {
                id: idsoal
            },
            include: {
                kumpulanjawaban: true,
                pembuat: {
                    select: { jumlahNotif: true }
                }
            }
        });

        if(DataSoal === null) return res.status(403).send("Error: 403");
        
        req.body.w = "jawaban"; //Ini beneran penting, jangan dihapus
        const HasilKompiler = await JalaninKompiler(req.body);

        if(typeof HasilKompiler === "number") 
            return res.status(HasilKompiler).send(`Error: ${HasilKompiler}`);
        
        if(HasilKompiler.gagal === 0) {
            const ApakahAdaSolusi = await prisma.solusi.findFirst({
                where: {
                    idsoal: DataSoal.id,
                    idusername: verifikasi,
                    bahasa
                }
            });

            if(ApakahAdaSolusi === null) {
                await prisma.solusi.create({
                    data: {
                        idsoal: DataSoal.id,
                        idusername: verifikasi,
                        kode: kode,
                        bahasa
                    }
                });
            } else {
                await prisma.solusi.update({
                    where: {
                        id: ApakahAdaSolusi.id
                    },
                    data: {
                        kode
                    }
                })
            }
            
            const SemuaSolusi = await prisma.solusi.findMany({
                where: {
                    idsoal: DataSoal.id
                }
            });
            
            const DapatinNotifikasi = await prisma.notifikasi.findMany();

            const AchievementSolusi = async (berapa: number) => {
                if(SemuaSolusi.filter((v, i, a) => a.findIndex((t) => t.idusername === v.idusername) === i).length >= berapa) {
                    if(DapatinNotifikasi[DapatinNotifikasi.findIndex((t) => t.tipe === `${berapa} solusi ${DataSoal.id}`)] === undefined) {
                        await prisma.notifikasi.create({
                            data: {
                                iduserKirim: DataSoal.idpembuat,
                                iduserDari: verifikasi,
                                konten: `Soal kamu ${DataSoal.namasoal} mencapai ${berapa} solusi!`,
                                tipe: `${berapa} solusi ${DataSoal.id}`,
                                link: `/soal/${DataSoal.id}/solusi`
                            }
                        });

                        await prisma.akun.update({
                            where: {
                                id: DataSoal.idpembuat
                            },
                            data: {
                                jumlahNotif: DataSoal.pembuat.jumlahNotif + 1
                            }
                        });
                    }
                }
            }

            AchievementSolusi(10);
            AchievementSolusi(100);
            AchievementSolusi(1000);

            return res.redirect(200, 'sukses');
        }
        
        return res.status(403).send(`Error: gagal ${HasilKompiler.gagal}`);
    }
    
    return res.redirect(405, 'Method tidak boleh');
}