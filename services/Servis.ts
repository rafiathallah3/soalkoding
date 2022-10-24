import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../database/prisma";
import { decrypt } from "../database/UbahKeHash";
import jwt from 'jsonwebtoken';
import { WarnaStatus } from "../types/tipe";

export async function UpdateInfoAkun(req: NextApiRequest, res: NextApiResponse, DapatinUser: boolean) {
    const infoakun = getCookie('infoakun', { req, res }) as string;
    if (infoakun === undefined) return { redirect: { destination: '/login', permanent: false } };

    try {
        var DapatinToken = await axios.post("http://localhost:3003/api/dapatintokenbaru", {}, {
            headers: { cookie: req.headers.cookie } as any
        }).then(d => d.data);

        setCookie('infoakun', DapatinToken, {
            req, res,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
            secure: process.env.NODE_ENV !== "development"
        });
    } catch {
        deleteCookie('infoakun', { req, res });
        deleteCookie('perbaruitoken', { req, res });
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    if(!DapatinUser) return DapatinToken;

    const DataUser = await prisma.akun.findUnique({
        where: {
            id: JSON.parse(decrypt((jwt.verify(DapatinToken, process.env.TOKENRAHASIA!) as any).datanya)).id
        },
        include: {
            akungithub: {
                select: { username: true }
            }
        }
    });

    if(DataUser === null) return { redirect: { destination: '/login', permanent: false } }
    if(DataUser.username === "" || DataUser.email === "") return { redirect: { destination: '/register/daftargithub', permanent: false } }

    return DataUser;
}

export const KirimNotifikasi = (status: WarnaStatus, pesan: string, { req, res }: { req: NextApiRequest, res: NextApiResponse }): void => setCookie('notif', { status, pesan }, { req, res, maxAge: 5 })