import { NextApiRequest, NextApiResponse } from "next";
import { ApakahSudahMasuk, JalaninKompiler } from "../../../../lib/Servis";

export default async function KonfirmasiKode(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        const { kode, bahasa } = req.body;
    
        if(kode === undefined && bahasa === undefined) return res.status(404).send("Tidak ketemu");
        const HasilKompiler = await JalaninKompiler(req.body);

        if(typeof HasilKompiler === "number") 
            return res.status(HasilKompiler).send(`Error: ${HasilKompiler}`);
        
        return res.json(HasilKompiler);
    }

    return res.status(405).send("Method tidak boleh");
}