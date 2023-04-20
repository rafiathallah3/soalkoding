import { NextApiRequest, NextApiResponse } from 'next';
import { ApakahSudahMasuk, KirimNotifikasi } from '../../../../lib/Servis';
import { DataModel } from '../../../../lib/Model';
import { IDiskusi, ISoal, WarnaStatus } from '../../../../types/tipe';

const TipeKondisi: { up: "upvote", down: "downvote" } = {
    up: "upvote",
    down: "downvote"
}

export default async function Diskusi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        const { idsoal, idsolusi, iddiskusi, status, text, tipe, jenis }: { idsoal: string, idsolusi: string, iddiskusi: string, status: "up" | "down", text: string, tipe: "buat" | "hapus" | "vote", jenis: "soal" | "solusi" } = req.body;
        if(jenis === undefined) return res.status(403).send("Error");
        
        const DataSoal = await DataModel.SoalModel.findById(idsoal) as ISoal || null;
        if(DataSoal === null) return res.status(404).send("Soal tidak ketemu");

        if(tipe === "buat") {
            if(text === undefined) return res.status(400).send("Error: 400");

            const DataDiskusi = await DataModel.DiskusiModel.create({
                user: session.props.Akun.id, soal: DataSoal, text
            });

            if(jenis === "soal") {
                await DataModel.SoalModel.findByIdAndUpdate(idsoal, { $push: { diskusi: DataDiskusi } });
            } else {
                await DataModel.SolusiModel.findByIdAndUpdate(idsolusi, { $push: { diskusi: DataDiskusi } });
            }

            return res.send("Sukses");
        }

        const DataDiskusi = await DataModel.DiskusiModel.findById(iddiskusi).populate("user") as IDiskusi || null;
        if(DataDiskusi === null) return res.status(404).send("Error: 404");

        if(tipe === "vote") {
            if(status === "up" && DataDiskusi.downvote.includes(session.props.Akun.id)) {
                await DataModel.DiskusiModel.findByIdAndUpdate(iddiskusi, { $pull: { downvote: session.props.Akun.id } });
            } else if(status === "down" && DataDiskusi.upvote.includes(session.props.Akun.id)) {
                await DataModel.DiskusiModel.findByIdAndUpdate(iddiskusi, { $pull: { upvote: session.props.Akun.id } });
            }

            const ApakahAda = DataDiskusi[TipeKondisi[status]].includes(session.props.Akun.id);
            const Hasil = ApakahAda ? { [TipeKondisi[status]]: DataDiskusi[TipeKondisi[status]].filter((v) => v !== session.props.Akun.id) } : { [TipeKondisi[status]]: DataDiskusi[TipeKondisi[status]].concat([session.props.Akun.id]) }
            const UpdateDataDiskusi = await DataModel.DiskusiModel.findByIdAndUpdate(iddiskusi, Hasil, { new: true });

            return res.json({
                suka: ApakahAda ? "biasa" : status,
                berapa: UpdateDataDiskusi.upvote.length - UpdateDataDiskusi.downvote.length
            })
        }

        if(tipe === "hapus" && (DataDiskusi.user._id.toString() === session.props.Akun.id || session.props.Akun.moderator || session.props.Akun.admin)) {
            await DataModel.DiskusiModel.findByIdAndDelete(iddiskusi);
            if(jenis === "soal") {
                await DataModel.SoalModel.findByIdAndUpdate(idsoal, { $pullAll: { diskusi: [{ _id: iddiskusi }] } });
            } else {
                await DataModel.SolusiModel.findByIdAndUpdate(idsolusi, { $pullAll: { diskusi: [{ _id: iddiskusi }] } });
            }

            KirimNotifikasi(WarnaStatus.biru, "Diskusi berhasil di hapus!", { req, res });
            return res.send("Sukses");
        }

        return res.status(403).send("Error");
    }

    return res.status(405).send("Method tidak boleh");
}