import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../database/prisma";
import { UpdateInfoAkun } from "../../../services/Servis";
import { Akun } from "@prisma/client";
import kuripto from 'crypto';
import { setCookie } from "cookies-next";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { akungithub: { username: string } } & { redirect: string };
    const hasil = kuripto.randomBytes(10).toString('hex');
    const params = `client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3003/api/auth/callback/github&response_type=code&scope=read:user,user:email&state=${hasil}`;

    if (DapatinUser.redirect !== undefined) {
        setCookie('IniStateGithub_NantiJugaDihapus', hasil, { req, res, maxAge: 30 });

        return {
            redirect: {
                permanent: false,
                destination: `https://github.com/login/oauth/authorize?${params}`
            }
        }
    }
    if (DapatinUser.akungithub !== null) return { redirect: { destination: '/login' } }

    // let huruf = 'abcdefghijklmnopqrstuvwxyz0123456789';
    // let hasil = '';
    // for (let i = 0; i < 20; i++) {
    //     hasil += huruf.charAt(Math.floor(Math.random() * huruf.length));
    // }

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
            destination: `https://github.com/login/oauth/authorize?${params}`
        }
    }
}

export default function Hubungin() {
    return (
        <></>
    )
}