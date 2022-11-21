// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { encrypt } from "../../database/UbahKeHash";
import { prisma } from '../../database/prisma';
import { setCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if(req.method === "POST") {
		const { email, password } = req.body;

		const data = await prisma.akun.findFirst({
			where: {
				email
			}
		});

		if(data === null) return res.send("Ada yang salah");

		if(await bcrypt.compare(password, data.password)) {
			console.log("Ayo login");
			const EncryptData = encrypt(JSON.stringify({id: data.id}));
			const token = jwt.sign({ datanya: EncryptData }, process.env.TOKENRAHASIA!, { expiresIn: '1h' });
			const PerbaruiToken = jwt.sign({ datanya: EncryptData }, process.env.PERBARUITOKEN!);

			await prisma.akun.update({
				where: {
					id: data.id
				},
				data: {
					perbaruiToken: PerbaruiToken
				}
			});

			setCookie('infoakun', token, {req, res, httpOnly: true, maxAge: 60 * 60 * 24 * 30, path: '/', secure: process.env.NODE_ENV !== "development"})
			setCookie('perbaruitoken', PerbaruiToken, {req, res, httpOnly: true, maxAge: 60 * 60 * 24 * 30, path: '/', secure: process.env.NODE_ENV !== "development"})
			// setCookie('perbaruitoken', PerbaruiToken, {req, res, httpOnly: true, secure: process.env.NODE_ENV !== "development", sameSite: 'strict', maxAge: 60 * 60 * 24 * 30, path: '/'})

			// const hasilKue = kue.serialize("infoakun", token, {
			// 	httpOnly: true,
			// 	secure: process.env.NODE_ENV !== "development",
			// 	sameSite: "strict",
			// 	maxAge: 60 * 60 * 24 * 30,
			// 	path: "/"
			// });

			// const hasilPerbaruiKue = kue.serialize("perbaruitoken", PerbaruiToken, {
			// 	httpOnly: true,
			// 	secure: process.env.NODE_ENV !== 'development',
			// 	sameSite: "strict",
			// 	maxAge: 60 * 60 * 24 * 30,
			// 	path: '/'
			// });

			// res.setHeader("Set-Cookie", [hasilKue, hasilPerbaruiKue]);
			return res.send("benar");
		}

		return res.send("Ada yang salah");
		// const data = await DapatinSQL("SELECT username, email, password FROM users WHERE email = ?", [email]) as {username: string, email: string, password: string}[];
        // if(data.length <= 0) {
        //     return res.json({kondisi: "SALAH"});
        // }

		// if(await bcrypt.compare(password, data[0].password)) {
		// 	console.log("Ayo login");
		// 	const EncryptData = encrypt(JSON.stringify({email, username: data[0].username}));
						
		// 	const token = jwt.sign({datanya: EncryptData}, process.env.SECRET!);

		// 	const encode = kue.serialize("infoakun", token, {
		// 		httpOnly: true,
		// 		secure: process.env.NODE_ENV !== "development",
		// 		sameSite: "strict",
		// 		maxAge: 60 * 60 * 24 * 30,
		// 		path: "/"
		// 	});

		// 	res.setHeader("Set-Cookie", encode);
		// 	return res.json({kondisi: "benar"});
		// }

		// return res.json({kondisi: "SALAH"});
	}
}
