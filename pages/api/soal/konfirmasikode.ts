import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../database/prisma";
import axios from 'axios';
import Verifikasi from "../../../services/VerifikasiAkun";
import { OutputCompilerGodbolt, OutputCompilerWandbox, TipeInfoKode, TipeKonfirmasiJawaban } from "../../../types/tipe";
import { DapatinServisKompiler } from "../../../services/TemplateBahasaProgram";
import { JalaninKompiler } from "../../../services/Servis";

export default async function KonfirmasiKode(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error: ${verifikasi}`);
    
        const { buat, kode, idsoal, w: StatusJawaban, bahasa } = req.body;
    
        if(kode === undefined && bahasa === undefined) return res.status(404).send("Tidak ketemu");
        const HasilKompiler = await JalaninKompiler(req);

        if(typeof HasilKompiler === "number") 
            return res.status(HasilKompiler).send(`Error: ${HasilKompiler}`);
        
        return res.json(HasilKompiler);
    } else {
        res.status(405).send("Error: 405");
    }
}