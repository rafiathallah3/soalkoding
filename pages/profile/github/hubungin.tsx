import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../database/prisma";
import { decrypt } from "../../../database/UbahKeHash";
import jwt from 'jsonwebtoken';

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const infoakun = getCookie('infoakun', { req, res }) as string;
    if (infoakun === undefined) return { redirect: { destination: '/login', permanent: false } };

    try {
        var DapatinToken = await axios.post("http://localhost:3003/api/dapatintokenbaru", {}, {
            headers: { cookie: req.headers.cookie } as any
        }).then(d => d.data);

        setCookie('infoakun', DapatinToken, {
            req, res,
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
            path: "/"
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

    const DapatinUser = await prisma.akun.findUnique({
        where: {
            id: JSON.parse(decrypt((jwt.verify(DapatinToken, process.env.TOKENRAHASIA!) as any).datanya)).id
        }
    })

    if (DapatinUser === null) return { redirect: { destination: '/login', permanent: false } };
    if (DapatinUser.githuburl !== null) return { redirect: { destination: '/login' } }

    let huruf = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let hasil = '';
    for (let i = 0; i < 20; i++) {
        hasil += huruf.charAt(Math.floor(Math.random() * huruf.length));
    }

    console.log(hasil);
    await prisma.akun.update({
        where: {
            id: DapatinUser.id
        },
        data: {
            githubstate: hasil
        }
    });

    return {
        redirect: {
            permanent: false,
            destination: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost:3003%2Fapi%2Fcallback&response_type=code&scope=read%3Auser%2Cuser%3Aemail&state=${hasil}`
        }
    }
}

export default function Hubungin() {
    return (
        <></>
    )
}