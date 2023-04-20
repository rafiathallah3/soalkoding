import { NextApiRequest, NextApiResponse } from 'next';
import { ApakahSudahMasuk } from '../../../../../lib/Servis';
import { DataModel } from '../../../../../lib/Model';
import { ISolusi } from '../../../../../types/tipe';

export default async function HapusSolusi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        const { idsolusi } = req.body;

        const DataSolusi = await DataModel.SolusiModel.findById(idsolusi).populate("user").populate("soal") as ISolusi || null;
        if(DataSolusi === null) return res.send("Solusi tidak ada");

        if((session.props.Akun.admin || session.props.Akun.moderator || session.props.Akun.id === DataSolusi.user._id.toString()) && DataSolusi.user._id.toString() !== DataSolusi.soal.pembuat._id.toString()) {
            await DataModel.SolusiModel.findOneAndDelete({ _id: idsolusi });
            await DataModel.AkunModel.findByIdAndUpdate(DataSolusi.user._id, { $pullAll: { soalselesai: [{ _id: idsolusi }] } });
            await DataModel.SoalModel.findByIdAndUpdate(DataSolusi.soal._id, { $pullAll: { solusi: [{ _id: idsolusi }] } });        
        }

        return res.status(200).send("Sukses di hapus!");
    }
    return res.status(405).send("Method tidak boehl");
}