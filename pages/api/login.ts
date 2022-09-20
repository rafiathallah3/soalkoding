// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken';
import kue from 'cookie'
import bcrypt from 'bcrypt';
import { encrypt, decrypt } from "../../database/UbahKeHash";
import { DapatinSQL } from '../../database/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if(req.method === "POST") {
		if(!req.body) {
			res.statusCode = 404;
			res.end("Error");
			return;
		}

		const { email, password } = req.body;

		const data = await DapatinSQL("SELECT username, email, password FROM users WHERE email = ?", [email]) as {username: string, email: string, password: string}[];
        if(data.length <= 0) {
            return res.json({kondisi: "SALAH"});
        }

		if(await bcrypt.compare(password, data[0].password)) {
			console.log("Ayo login");
			const EncryptData = encrypt(JSON.stringify({email, username: data[0].username}));
						
			const token = jwt.sign({datanya: EncryptData}, process.env.SECRET!);

			const encode = kue.serialize("infoakun", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV !== "development",
				sameSite: "strict",
				maxAge: 60 * 60 * 24 * 30,
				path: "/"
			});

			res.setHeader("Set-Cookie", encode);
			return res.json({kondisi: "benar"});
		}

		return res.json({kondisi: "SALAH"});

		// const token = jwt.sign({
		// 	email,
		// 	kadaluarsa: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
		// }, process.env.SECRET!);
		
		// const encode = kue.serialize("infoakun", token, {
		// 	httpOnly: true,
		// 	secure: process.env.NODE_ENV !== "development",
		// 	sameSite: "strict",
		// 	maxAge: 60 * 60 * 24 * 30,
		// 	path: "/"
		// });
		// console.log(encode);

		// res.setHeader("Set-Cookie", encode);
		// res.redirect("/dashboard");
	}
}
