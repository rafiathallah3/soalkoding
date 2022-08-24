import { NextApiRequest, NextApiResponse } from "next";
import kue from 'cookie';

export default function Logout(req: NextApiRequest, res: NextApiResponse) {
    console.log("Keluar");
    const encode = kue.serialize('infoakun', '', {
        maxAge: -1,
        path: '/'
    });

    res.setHeader("Set-Cookie", encode);
    return res.redirect("/");
}