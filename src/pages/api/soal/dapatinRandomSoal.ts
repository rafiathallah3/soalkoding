import { NextApiRequest, NextApiResponse } from "next";
import { ApakahSudahMasuk } from "../../../../lib/Servis";
import { DataModel } from "../../../../lib/Model";
import { ISoal } from "../../../../types/tipe";

export default async function DapatinRandomSoal(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        const DataSoal = await DataModel.SoalModel.find({ public: true }).populate("solusi").populate("pembuat") as ISoal[];
        const PilihanSoal = DataSoal.filter((v) => v.solusi.filter((j) => j.user._id.toString() === session.props.Akun.id).length <= 0);
        
        return res.json({
            data: PilihanSoal[Math.floor(Math.random() * PilihanSoal.length)],
        })
    }

    return res.status(405).send("Tidak boleh");
}