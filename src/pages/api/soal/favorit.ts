import { NextApiRequest, NextApiResponse } from "next";
import { ApakahSudahMasuk } from "../../../../lib/Servis";
import { DataModel } from "../../../../lib/Model";
import { IFavorit, ISoal } from "../../../../types/tipe";

export default async function Favorit(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        const { idsoal } = req.body;

        const DataSoal = await DataModel.SoalModel.findById(idsoal) as ISoal || null;
        if(!DataSoal) return res.status(404).send("Soal tidak ketemu");

        const ApakahFavoritAda = await DataModel.FavoritModel.exists({ user: session.props.Akun.id, soal: DataSoal._id.toString() });
        if(ApakahFavoritAda === null) {
            const DataFavorit = await DataModel.FavoritModel.create({
                user: session.props.Akun.id,
                soal: DataSoal._id.toString()
            }) as IFavorit;

            await DataModel.SoalModel.findByIdAndUpdate(DataSoal._id, { $push: { favorit: DataFavorit } });
            await DataModel.AkunModel.findByIdAndUpdate(session.props.Akun.id, { $push: { favorit: DataFavorit } });
        } else {
            await DataModel.FavoritModel.deleteOne({ user: session.props.Akun.id, soal: DataSoal._id.toString() });
            await DataModel.SoalModel.findByIdAndUpdate(idsoal, { $pullAll: { favorit: [{ _id: ApakahFavoritAda._id }] } });
            await DataModel.AkunModel.findByIdAndUpdate(session.props.Akun.id, { $pullAll: { favorit: [{ _id: ApakahFavoritAda._id }] } });
        }

        const FavoritSoal = await DataModel.SoalModel.findById(DataSoal._id) as ISoal;

        return res.json({ suka_ngk: ApakahFavoritAda === null, berapa: FavoritSoal.favorit.length});
    }

    return res.status(405).send("Method tidak boleh");
}