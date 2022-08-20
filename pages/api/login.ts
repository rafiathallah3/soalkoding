// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken';
import kue from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if(req.method === "POST") {
		if(!req.body) {
			res.statusCode = 404;
			res.end("Error");
			return;
		}

		const { email, password } = req.body;
		const token = jwt.sign({
			email,
			kadaluarsa: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
		}, process.env.SECRET!);
		
		const encode = kue.serialize("infoakun", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development",
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 30,
			path: "/"
		});
		console.log(encode);

		res.setHeader("Set-Cookie", encode);
		res.redirect("/dashboard");
	}
}
