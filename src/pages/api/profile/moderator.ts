import { NextApiRequest, NextApiResponse } from "next";
import { ApakahSudahMasuk } from "../../../../lib/Servis";
import { DataModel } from "../../../../lib/Model";
import { IAkun } from "../../../../types/tipe";

export default async function Moderator(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.status(401).send("Belum login");
        if(!session.props.Akun.admin) return res.status(401).send("Sukses jadikan moderator!");
    
        const { username } = req.body;
        const UserJadikanMod = await DataModel.AkunModel.findOne({ username }) as IAkun || null;
    
        if(UserJadikanMod === null) return res.status(404).send("Error: 404");
    
        await DataModel.AkunModel.updateOne({ username }, { moderator: !UserJadikanMod.moderator });

        return res.send("Sukses");
    }

    return res.status(405).send("Error: 405");
}