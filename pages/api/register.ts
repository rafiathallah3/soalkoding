import { NextApiRequest, NextApiResponse } from "next";
import { DapatinSQL } from "../../database/db";
import bcrypt from 'bcrypt'

export default async function Register(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const { username, email, password } = req.body;
        const data = await DapatinSQL("SELECT username, email, password FROM users WHERE email = ?", [email]) as [];
        if(data.length <= 0) {
            const garam = await bcrypt.genSalt();
            const hasPass = await bcrypt.hash(password, garam);

            await DapatinSQL("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hasPass]);
            return res.json({kondisi: "sukses"});
        }

        return res.json({kondisi: "Email sudah dipakai"});
    } 

    return res.redirect(405, 'Method not allowed')
}