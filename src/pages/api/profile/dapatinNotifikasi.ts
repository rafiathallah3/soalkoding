import { NextApiRequest, NextApiResponse } from 'next';
import { ApakahSudahMasuk } from '../../../../lib/Servis';
import { DataModel } from '../../../../lib/Model';

export default async function DapatinNotifikasi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");

        await DataModel.AkunModel.findOneAndUpdate({ _id: session.props.Akun.id, "notifikasi.SudahLiat": false }, { $set: { "notifikasi.$.SudahLiat": true } });
        const UpdateAkun = await DataModel.AkunModel.findById(session.props.Akun.id)
            .populate({ path: "notifikasi.userDari" })
            .populate({ path: "notifikasi.userKirim" });
        
        return res.json({ 
            data: UpdateAkun === null ? [] : UpdateAkun.notifikasi
        })
    }
}