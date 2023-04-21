import { NextApiRequest, NextApiResponse } from 'next';
import { ApakahSudahMasuk } from '../../../../../lib/Servis';
import { DataModel } from '../../../../../lib/Model';
import { TipeInfoKode } from '../../../../../types/tipe';

export default async function BuatSoal(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        if(Object.values(req.body).every((v) => (v as string).trim() === "")) return res.status(403).send("Error 403");
        const { namasoal, level, tags, soal, infokode }: { namasoal: string, level: string, tags: string[], soal: string, infokode: { [bahasa: string]: TipeInfoKode } } = req.body;
        
        for(const [bahasa, val] of Object.entries(infokode)) {
            if(val.contohjawaban === undefined || val.jawabankode === undefined || val.liatankode === undefined || val.listjawaban === undefined) {
                delete infokode[bahasa];
                continue;
            }

            if(val.contohjawaban.trim() === "" && val.jawabankode.trim() === "" && val.liatankode.trim() === "" && val.listjawaban.trim() === "") {
                delete infokode[bahasa];
                continue;
            }

            if(val.contohjawaban.trim() === "") {
                return res.json({ error: `ContohJawaban tidak boleh kosong, bahasa: ${bahasa}` });
            }

            if(val.jawabankode.trim() === "") {
                return res.json({ error: `JawabanKode tidak boleh kosong, bahasa: ${bahasa}` });
            }

            if(val.liatankode.trim() === "") {
                return res.json({ error: `LiatanKode tidak boleh kosong, bahasa: ${bahasa}` });
            }

            if(val.listjawaban.trim() === "") {
                return res.json({ error: `ListJawaban tidak boleh kosong, bahasa: ${bahasa}` });
            }
        }

        if(Object.keys(infokode).length <= 0) return res.json({ error: "Ada kesalahan saat mengambil kode" });

        try {
            const DataSoal = await DataModel.SoalModel.create({
                namasoal, level: parseInt(level), tags, soal, 
                pembuat: session.props.Akun.id, 
                public: false, 
                BahasaSoal: Object.values(infokode), 
            });

            const Solusi = [];
            for(const v of Object.values(infokode)) {
                Solusi.push(await DataModel.SolusiModel.create({
                    bahasa: v.bahasa,
                    kode: v.jawabankode,
                    user: session.props.Akun.id,
                    idsoal: DataSoal._id,
                    soal: DataSoal
                }));
            }

            await DataModel.SoalModel.findByIdAndUpdate(DataSoal._id, { solusi: Solusi })
            return res.json({ id: DataSoal._id });
        } catch(e) {
            return res.json({ error: JSON.stringify((e as any).errors) });
        }
    }

    return res.status(405).send("Method tidak boleh");
}