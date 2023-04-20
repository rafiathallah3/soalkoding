import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';
import connectDb from "../../../lib/mongodb";
import { DataModel } from "../../../lib/Model";
import { IAkun } from "../../../types/tipe";

export default async function Register(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const { username, email, password } = req.body;
        if(username.replace(/\s\s+/g, ' ').trim().length <= 4) 
            return res.json({ kondisi: "error", pesan: "Username harus lebih dari 4 karakter!"});

        if(email.replace(/\s\s+/g, ' ').trim().length <= 10)
            return res.json({ kondisi: "error", pesan: "Email harus lebih dari 10 karakter!"});

        if(password.replace(/\s\s+/g, ' ').trim().length <= 8) 
            return res.json({ kondisi: "error", pesan: "Password harus lebih dari 8 karakter!"});

        connectDb();
        
        console.log("Mau buat akun");
        try {
            const ApakahAdaEmailDanUsername = await DataModel.AkunModel.findOne({
                $or: [
                    { email },
                    { username }
                ]
            }) as IAkun | null;
    
            if(ApakahAdaEmailDanUsername === null) {
                await DataModel.AkunModel.create({
                    email, username, password: await bcrypt.hash(password.replace(/\s\s+/g, ' ').trim(), await bcrypt.genSalt())
                });
                console.log("Sudah buat");
    
                return res.json({ kondisi: "sukses" });
            }
    
            if(ApakahAdaEmailDanUsername.email === email)
                return res.json({ kondisi: "error", pesan: 'Email sudah dipakai'});
            
    
            if(ApakahAdaEmailDanUsername.username === username)
                return res.json({ kondisi: "error", pesan: 'Username sudah dipakai'});
            
            return res.status(404).send("Ada Error");
        } catch(e) {
            console.log(e);
            return res.status(500).send("Ada Error");
        }
    }

    return res.redirect(405, "Method not allowed");
}