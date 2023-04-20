import { NextApiRequest, NextApiResponse } from "next";
import { ApakahSudahMasuk } from "../../../../../lib/Servis";
import { DataModel } from "../../../../../lib/Model";
import { ISolusi } from "../../../../../types/tipe";

export default async function dapatinSolusi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        const { idsoal, lihat, berdasarkan, bahasa } = req.body;

        const KondisiFind: { [key: string]: string } = { soal: idsoal }
        if(lihat === "sendiri") {
            KondisiFind.user = session.props.Akun.id
        }
        if(bahasa && bahasa !== "semua") {
            KondisiFind.bahasa = bahasa;
        }

        const KondisiSort: { [key: string]: number | string } = {};
        if(berdasarkan === "kepintaran") {
            KondisiSort.pintar = -1;
        }
        if(berdasarkan === "baru") {
            KondisiSort.createdAt = "desc";
        }
        if(berdasarkan === "lama") {
            KondisiSort.createdAt = "asc";
        }

        const DataSolusi = await DataModel.SolusiModel.find(KondisiFind)
            .populate("user")
            .sort(KondisiSort as unknown as any) as ISolusi[] || null;
        if(DataSolusi === null) return res.status(404).send("Soal tidak ketemu");

        return res.json({
            solusi: DataSolusi.map((v) => ({
                ...(v as unknown as {_doc: any})['_doc'],
                apakahSudahPintar: v.pintar.includes(session.props.Akun.id)
            }))
        })
    }

    return res.status(405).send("Method tidak boleh");
}