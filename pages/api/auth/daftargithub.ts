import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../database/prisma";
import { deleteCookie, getCookie } from "cookies-next";
import { decrypt } from "../../../database/UbahKeHash";
import { KirimNotifikasi } from "../../../services/Servis";
import { WarnaStatus } from "../../../types/tipe";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function DaftarGithub(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const infoakun = getCookie('infoakun', { req, res }) as string;
        if (infoakun === undefined) return { redirect: { destination: '/login', permanent: false } };

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: JSON.parse(decrypt((jwt.verify(infoakun, process.env.TOKENRAHASIA!) as any).datanya)).id
            },
            include: {
                akungithub: true
            }
        });

        if (DataUser === null) {
            deleteCookie('infoakun', { req, res });
            deleteCookie('perbaruitoken', { req, res });
            return { redirect: { destination: '/login', permanent: false } }
        }
        if (DataUser.username !== "" || DataUser.email !== "") return { redirect: { destination: '/dashboard', permanent: false } }

        const { email, username, password, konfirmasipassword } = req.body;

        if(password !== konfirmasipassword) {
            KirimNotifikasi(WarnaStatus.kuning, "Password tidak sesuai dengan konfirmasi", { req, res });
            return res.status(400).redirect("/register/daftargithub")
        }

        const ApakahAdaEmailDanUsername = await prisma.akun.findMany({
            where: {
                OR: [
                    {
                        email
                    },
                    {
                        username
                    }
                ]
            }
        });

        if(ApakahAdaEmailDanUsername.length <= 0) {
            const garam = await bcrypt.genSalt();
            const HashPassword = await bcrypt.hash(password, garam);

            await prisma.akun.update({
                where: {
                    id: DataUser.id
                },
                data: {
                    email,
                    username,
                    password: HashPassword,
                    gambarurl: DataUser.akungithub?.gambar
                }
            })

            console.log("Selamat dangan github user!");
            return res.redirect("/dashboard");
        }
        
        if(ApakahAdaEmailDanUsername[0].email === email) {
            KirimNotifikasi(WarnaStatus.kuning, "Email sudah dipakai", { req, res });
            return res.status(400).redirect('/register/daftargithub');
        }

        if(ApakahAdaEmailDanUsername[0].username === username) {
            KirimNotifikasi(WarnaStatus.kuning, "Username sudah dipakai", { req, res });
            return res.status(400).redirect("/register/daftargithub");
        }
    }

    return res.status(405).send("Error: 405");
}