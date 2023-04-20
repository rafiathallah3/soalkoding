import { NextApiRequest, NextApiResponse } from 'next';
import { ApakahSudahMasuk, KirimNotifikasi } from '../../../../../lib/Servis';
import { DataModel } from '../../../../../lib/Model';
import { ISoal, WarnaStatus } from '../../../../../types/tipe';

export default async function HapusSoal(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        const { idsoal } = req.body;

        const DataSoal = await DataModel.SoalModel.findOne({ _id: idsoal, pembuat: session.props.Akun.id }) as ISoal || null;
        if(DataSoal === null) return res.send("Sukses dihapus!");

        await DataModel.SoalModel.findByIdAndDelete(idsoal);
        await DataModel.SolusiModel.deleteMany({ soal: idsoal });
        await DataModel.DiskusiModel.deleteMany({ soal: idsoal });
        await DataModel.FavoritModel.deleteMany({ soal: idsoal });

        KirimNotifikasi(WarnaStatus.biru, "Soal sukses dihapus!", { req, res });

        return res.send("Sukses");
    }

    return res.status(405).send("Method tidak boleh");
}