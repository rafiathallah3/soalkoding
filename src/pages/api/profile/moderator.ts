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

        const UpdateData: {[st: string]: any} = { moderator: !UserJadikanMod.moderator };
        if(!UserJadikanMod.moderator) {
            UpdateData["$push"] = {notifikasi: { 
                userDari: session.props.Akun.id, 
                userKirim: UserJadikanMod._id.toString(), 
                konten: `${session.props.Akun.username} membuat kamu menjadi moderator!`, 
                link: `/profile/${UserJadikanMod.username}`,
                tipe: "jadi moderator"
            }}
        }
        await DataModel.AkunModel.updateOne({ username }, UpdateData);

        return res.send("Sukses");
    }

    return res.status(405).send("Error: 405");
}