import { NextApiRequest, NextApiResponse } from "next";
import { ApakahSudahMasuk } from "../../../../../lib/Servis";
import bcrypt from 'bcrypt';
import { DataModel } from "../../../../../lib/Model";
import { IAkun } from "../../../../../types/tipe";

export default async function GantiPassword(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.redirect("/login");

        const { passwordbaru, konfirmasipassword, password } = req.body;
        if(passwordbaru !== konfirmasipassword) return res.send("Password berbeda dengan konfirmasi");
        if(password.length < 5) return res.send("Password harus lebih dari 5 karakter!");

        const Akun = await DataModel.AkunModel.findOne({ email: session.props.Akun.email }) as IAkun;

        if(Akun.password === undefined) {
            await DataModel.AkunModel.findOneAndUpdate({ email: session.props.Akun.email }, { password: await bcrypt.hash(passwordbaru, await bcrypt.genSalt()) });
            return res.status(200).send("sukses");
        } else {
            if(await bcrypt.compare(password, Akun.password)) {
                await DataModel.AkunModel.updateOne({ email: session.props.Akun.email }, { password: await bcrypt.hash(passwordbaru, await bcrypt.genSalt()) });
                return res.status(200).send("sukses");
            }
        }

        return res.send("Password Salah");
    }

    return res.status(405).send("Method tidak boleh");
}