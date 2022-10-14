import { NextApiRequest, NextApiResponse } from "next";
// import kue from 'cookie';
import { deleteCookie, getCookie } from 'cookies-next';
import { decrypt } from "../../database/UbahKeHash";
import { verify } from "../../services/jwt_sign";
import prisma from "../../database/prisma";

export default async function Logout(req: NextApiRequest, res: NextApiResponse) {
    const Infoomasi = await verify(getCookie('infoakun', { req, res }) as string, process.env.TOKENRAHASIA!) as { datanya: {iv: string, IniDataRahasia: string} };
    const HasilDecrypt: {id: string} = JSON.parse(decrypt(Infoomasi.datanya));

    await prisma.users.update({
        where: {
            id: HasilDecrypt.id
        },
        data: {
            perbaruiToken: ''
        }
    })

    deleteCookie('infoakun', { req, res });
    deleteCookie('perbaruitoken', { req, res });

    // const encode = kue.serialize('infoakun', '', {
    //     maxAge: -1,
    //     path: '/'
    // });

    // res.setHeader("Set-Cookie", encode);
    return res.redirect("/login");
}