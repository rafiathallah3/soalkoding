import { NextApiRequest, NextApiResponse } from 'next';
import { ApakahSudahMasuk, JalaninKompiler, KirimNotifikasi } from '../../../../../lib/Servis';
import { DataModel } from '../../../../../lib/Model';
import { ISoal, TipeInfoKode, WarnaStatus } from '../../../../../types/tipe';
import { DapatinSemuaBahasa } from '../../../../../lib/TemplateBahasaProgram';

export default async function UpdateSoal(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        const { idsoal, namasoal, level, tags, soal, infokode, publicsoal }: { idsoal: string, namasoal: string, level: number, tags: string[], soal: string, infokode: { [bahasa: string]: TipeInfoKode }, publicsoal: boolean } = req.body;

        const DataSoal = await DataModel.SoalModel.findOne({ _id: idsoal, pembuat: session.props.Akun.id }) as ISoal || null;

        if(!DataSoal) return res.status(403).send({ error: `Soal tidak ketemu` });

        const KompilerGagal = [];
        for(const [bahasa, i] of Object.entries(infokode)) {
            if(i.contohjawaban === undefined || i.jawabankode === undefined || i.liatankode === undefined || i.listjawaban === undefined) {
                delete infokode[bahasa];
                continue;
            }

            if(i.contohjawaban.trim() === "" && i.jawabankode.trim() === "" && i.liatankode.trim() === "" && i.listjawaban.trim() === "") {
                const solusi = await DataModel.SolusiModel.findOneAndDelete({ soal: DataSoal, bahasa, user: session.props.Akun.id }, { new: true });
                console.log(await DataModel.SoalModel.findByIdAndUpdate(idsoal, { $pull: { BahasaSoal: { bahasa }, solusi: solusi._id } }, { new: true }));
                delete infokode[bahasa];
                continue;
            }

            const HasilKompiler = await JalaninKompiler({ buat: infokode, bahasa: i.bahasa, kode: i.jawabankode });

            if(typeof HasilKompiler === "number") 
                return res.json({ error: `Ada kesalahan saat ngekompile kode jawaban ${bahasa}` });

            if(i.contohjawaban.trim() === "" || i.listjawaban.trim() === "") continue;

            const KumpulanJawaban = DataSoal.BahasaSoal.find((v) => v.bahasa === i.bahasa);
            if(KumpulanJawaban === undefined) {
                if(!DapatinSemuaBahasa().includes(i.bahasa))
                    return res.status(404).send("Error: 404");
                
                const Solusi = await DataModel.SolusiModel.create({
                    user: session.props.Akun.id,
                    idsoal,
                    kode: i.jawabankode,
                    bahasa: i.bahasa,
                    soal: DataSoal._id
                })

                await DataModel.SoalModel.findByIdAndUpdate(idsoal, { 
                    $push: { 
                        BahasaSoal: i, 
                        solusi: Solusi 
                    } 
                });
            } else {
                await DataModel.SolusiModel.updateOne({ idsoal, user: session.props.Akun.id, bahasa: i.bahasa }, { kode: i.jawabankode, bahasa: i.bahasa });

                await DataModel.SoalModel.updateOne({ _id: idsoal, "BahasaSoal.bahasa": i.bahasa }, {
                    $set: {
                        "BahasaSoal.$.listjawaban": i.listjawaban,
                        "BahasaSoal.$.contohjawaban": i.contohjawaban,
                        "BahasaSoal.$.liatankode": i.liatankode,
                        "BahasaSoal.$.jawabankode": i.jawabankode,
                    }
                });
            }

            if(HasilKompiler.gagal !== 0) {
                KompilerGagal.push(i.bahasa);
            }
        }

        await DataModel.SoalModel.findByIdAndUpdate(idsoal, {
            namasoal, level, tags, soal, public: KompilerGagal.length > 0 ? false : publicsoal
        });

        if(KompilerGagal.length > 0 && publicsoal)
            return res.json({ error: `Tidak bisa dipublickan karena list jawaban dari kode bahasa ${KompilerGagal.join(",")} tidak sesuai dengan jawaban yang ditentukan` });
        
        KirimNotifikasi(WarnaStatus.biru, "Soal sudah diupdate!", { req, res });
        return res.send("Sukses");
    }

    return res.status(405).send("Method tidak boleh");
}