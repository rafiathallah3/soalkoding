import type { NextApiRequest, NextApiResponse } from 'next';
import { ApakahSudahMasuk } from '../../../../../lib/Servis';
import { DataModel } from '../../../../../lib/Model';
import { ISolusi } from '../../../../../types/tipe';
import { UpdateQuery } from 'mongoose';

export default async function Pintar(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        const { idsolusi } = req.body;

        const DataSolusi = await DataModel.SolusiModel.findById(idsolusi) as ISolusi || null;
        if(DataSolusi === null) return res.status(404).send("Tidak ada");

        const HasilData: UpdateQuery<ISolusi> = {}
        if(DataSolusi.pintar.includes(session.props.Akun.id)) {
            HasilData.$pull = { pintar: session.props.Akun.id }
        } else {
            HasilData.$push = { pintar: session.props.Akun.id }
        }

        const UpdateSolusi = await DataModel.SolusiModel.findByIdAndUpdate(idsolusi, HasilData, { new: true }) as ISolusi;

        return res.json({ suka_ngk: UpdateSolusi.pintar.includes(session.props.Akun.id), berapa: UpdateSolusi.pintar.length })
    }

    return res.status(405).send("Method tidak boleh");
}