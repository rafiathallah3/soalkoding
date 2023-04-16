import { NextApiRequest, NextApiResponse } from "next";
import { DataModel } from "./Model";
import { IAkun } from "../types/tipe";
import connectDb from "./mongodb";
import { getServerSession } from "next-auth";
import { deleteCookie } from "cookies-next";
import { v2 as cloudinary } from "cloudinary";

export async function ApakahSudahMasuk(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, {});
    if(!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },        
        }
    }

    connectDb();

    const Akun = await DataModel.AkunModel.findOne({ email: session.user!.email }) as IAkun | null;

    if(!Akun) {
        deleteCookie("next-auth.session-token", { req, res });
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    return {
        props: {
            Akun: {
                id: Akun._id.toString(),
                username: Akun?.username,
                email: Akun?.email,
                gambar: Akun?.gambar,
                nama: Akun?.nama,
                bio: Akun?.bio,
                tinggal: Akun?.tinggal,
                website: Akun?.website,
            }
        }
    }
}

export function SemenjakWaktu(date: Date) {
    var seconds = Math.floor((new Date() as any - (date as any)) / 1000);

    let interval = seconds / 31536000;

    if (interval >= 1) {
        return Math.floor(interval) + " tahun lalu";
    }
    interval = seconds / 2592000;
    if (interval >= 1) {
        return Math.floor(interval) + " bulan lalu";
    }
    interval = seconds / 86400;
    if (interval >= 1) {
        return Math.floor(interval) + " hari lalu";
    }
    interval = seconds / 3600;
    if (interval >= 1) {
        return Math.floor(interval) + " jam lalu";
    }
    interval = seconds / 60;
    if (interval >= 1) {
        return Math.floor(interval) + " menit lalu";
    }
    return Math.floor(seconds) + " detik lalu";
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export { cloudinary };