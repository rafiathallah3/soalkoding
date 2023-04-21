import { NextApiRequest, NextApiResponse } from "next";
import { ApakahSudahMasuk, JalaninKompiler } from "../../../../lib/Servis";
import { DataModel } from "../../../../lib/Model";
import { ISoal, ISolusi } from "../../../../types/tipe";

const AchievementSolusi = async (SemuaSolusi: ISolusi[], DataSoal: ISoal, Akun: { id: string }, berapa: number) => {
    if(SemuaSolusi.length >= berapa && DataSoal.pembuat.notifikasi.find((v) => v.tipe === `${berapa} solusi ${DataSoal._id.toString()}`) === undefined) {
        await DataModel.AkunModel.updateOne({ _id: DataSoal.pembuat._id }, { $push: { notifikasi: {
            userDari: Akun.id, 
            userKirim: DataSoal.pembuat._id.toString(), 
            konten: `Soal kamu ${DataSoal.namasoal} mencapai ${berapa} solusi!`, 
            link: `/soal/${DataSoal._id.toString()}/solusi`,
            tipe: `${berapa} solusi ${DataSoal._id.toString()}`
        } } })
    }
}

export default async function KirimSolusi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        const { kode, idsoal, bahasa } = req.body;
        if(kode === undefined || idsoal === undefined) return res.status(403).send("Error: 403");

        const DataSoal = await DataModel.SoalModel.findById(idsoal)
            .populate("pembuat")
            .populate({ path: "pembuat.notifikasi.userDari" })
            .populate({ path: "pembuat.notifikasi.userKirim" }) as ISoal || null;
        if(!DataSoal) return res.status(403).send("Error: 403");

        req.body.w = "jawaban"; //Ini beneran penting, jangan dihapus
        const HasilKompiler = await JalaninKompiler(req.body);

        if(typeof HasilKompiler === "number") 
            return res.status(HasilKompiler).send(`Error: ${HasilKompiler}`);

        if(HasilKompiler.gagal === 0) {
            const ApakahAdaSolusi = await DataModel.SolusiModel.findOne({
                soal: idsoal, user: session.props.Akun.id, bahasa
            }) as ISolusi || null;

            if(ApakahAdaSolusi === null) {
                const Solusi = await DataModel.SolusiModel.create({
                    idsoal, kode, bahasa, user: session.props.Akun.id, soal: DataSoal
                });
                await DataModel.AkunModel.findByIdAndUpdate(session.props.Akun.id, { $push: { soalselesai: Solusi } });
                await DataModel.SoalModel.findByIdAndUpdate(idsoal, { $push: { solusi: Solusi } });
            } else {
                await DataModel.SolusiModel.findByIdAndUpdate(ApakahAdaSolusi._id, { kode });
            }

            const SemuaSolusi = await DataModel.SolusiModel.find({ soal: idsoal }) as ISolusi[];

            AchievementSolusi(SemuaSolusi, DataSoal, session.props.Akun, 10);
            AchievementSolusi(SemuaSolusi, DataSoal, session.props.Akun, 50);
            AchievementSolusi(SemuaSolusi, DataSoal, session.props.Akun, 100);

            return res.status(200).send("sukses");
        }

        return res.status(403).send(`Error: gagal ${HasilKompiler.gagal}`);
    }

    return res.status(405).send("Method tidak boleh");
}