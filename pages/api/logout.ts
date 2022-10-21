import { NextApiRequest, NextApiResponse } from "next";
// import kue from 'cookie';
// import { decrypt } from "../../database/UbahKeHash";
// import { verify } from "../../services/jwt_sign";
import { deleteCookie } from 'cookies-next';
import { prisma } from "../../database/prisma";
import Verifikasi from "../../services/VerifikasiAkun";

export default async function Logout(req: NextApiRequest, res: NextApiResponse) {
    const verifikasi = Verifikasi(req, res);
    if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`); 

    await prisma.akun.update({
        where: {
            id: verifikasi
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