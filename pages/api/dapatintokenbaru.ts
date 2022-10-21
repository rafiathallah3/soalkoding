import { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { prisma } from "../../database/prisma";

export default async function DapatinTokenBaru(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const PerbaruiToken = getCookie('perbaruitoken', { req, res });
        // console.log("Lama", getCookie('infoakun', { req, res }));
        if(!PerbaruiToken) return res.status(401).send("Unauthorized");
        const DapatinUser = await prisma.akun.findFirst({
            where: {
                perbaruiToken: PerbaruiToken as string
            },
            select: {
                username: true
            }
        });
        if(!DapatinUser) return res.status(403).send("Forbidden");
        jwt.verify(PerbaruiToken as string, process.env.PERBARUITOKEN!, (err, user: any) => {
            if(err) return res.status(403).send("Forbidden");
            const token = jwt.sign({ datanya: { iv: user.datanya.iv, IniDataRahasia: user.datanya.IniDataRahasia } }, process.env.TOKENRAHASIA!, { expiresIn: '1h' });
            
            // console.log("Baru", token);
            res.status(200).send(token);
        })
    } else {
        return res.status(405);
    }
}