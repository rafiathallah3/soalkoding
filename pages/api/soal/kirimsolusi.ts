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
                kumpulanjawaban: true
            }
        });

        if(DataSoal === null) return res.status(403).send("Error: 403");
        
        req.body.w = "jawaban";
        const HasilKompiler = await JalaninKompiler(req);

        if(typeof HasilKompiler === "number") 
            return res.status(HasilKompiler).send(`Error: ${HasilKompiler}`);
        
        if(HasilKompiler.gagal === 0) {
            await prisma.solusi.create({
                data: {
                    idsoal: DataSoal.id,
                    idusername: verifikasi,
                    kode: kode,
                    bahasa
                }
            })
            return res.redirect(200, 'sukses');
        }
        
        return res.status(403).send(`Error: gagal ${HasilKompiler.gagal}`);
    }
    
    return res.redirect(405, 'Method tidak boleh');
}