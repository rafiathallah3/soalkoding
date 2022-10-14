import { NextApiRequest, NextApiResponse } from "next";
import { DapatinSQL } from "../../database/db";
import bcrypt from 'bcrypt'
import prisma from "../../database/prisma";

export default async function Register(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const { username, email, password } = req.body;

        const ApakahAdaEmailDanUsername = await prisma.akun.findMany({
            where: {
                OR: [
                    {
                        email
                    },
                    {
                        username
                    }
                ]
            }
        });
        // const apakahEmailAda = await prisma.akun.findUnique({
        //     where: {
        //         email: email,
        //     }
        // });

        console.log(ApakahAdaEmailDanUsername);
        if(ApakahAdaEmailDanUsername.length <= 0) {
            const garam = await bcrypt.genSalt();
            const HashPassword = await bcrypt.hash(password, garam);

            const data = await prisma.akun.create({
                data: {
                    username,
                    email,
                    password: HashPassword,
                }
            });

            return res.json({ kondisi: "sukses" });
        }
        
        if(ApakahAdaEmailDanUsername[0].email === email) {
            return res.status(404).send('Email sudah dipakai');
        }

        if(ApakahAdaEmailDanUsername[0].username === username) {
            return res.status(404).send('Username sudah dipakai');
        }
        // const data = await DapatinSQL("SELECT username, email, password FROM users WHERE email = ?", [email]) as [];
        // if(data.length <= 0) {
        //     const garam = await bcrypt.genSalt();
        //     const hasPass = await bcrypt.hash(password, garam);

        //     await DapatinSQL("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hasPass]);
        //     return res.json({kondisi: "sukses"});
        // }

        // return res.json({kondisi: "Email sudah dipakai"});
    } 

    return res.redirect(405, 'Method not allowed')
}