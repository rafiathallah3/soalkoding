import { Akun } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { KirimNotifikasi, UpdateInfoAkun } from "../../../services/Servis";
import { prisma } from "../../../database/prisma";
import { WarnaStatus } from "../../../types/tipe";
import { useRouter } from "next/router";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { akungithub: { username: string } } & { redirect: string };
    if (DapatinUser.redirect !== undefined) return DapatinUser; //Kalau ada redirect di UpdateInfoAkun akan diredirect ke login;

    const AkunGithub = await prisma.akunGithub.findUnique({
        where: {
            iduser: DapatinUser.id
        }
    });

    if (AkunGithub === null) {
        KirimNotifikasi(WarnaStatus.kuning, "Kamu belum menghubungkan github!", { req, res });
        return { redirect: { permanent: "false", destination: "/profile/edit" } }
    }

    await prisma.akun.update({
        where: {
            id: DapatinUser.id
        },
        data: {
            gambarurl: "/gambar/profile.png",
            akungithub: {
                disconnect: true
            }
        },
    });

    KirimNotifikasi(WarnaStatus.biru, "Akun kamu berhasil diputusin dengan github!", { req, res });
    return {
        props: {
            redirect: '/profile/edit'
        }
    }
}

export default function Putusin({ redirect }: { redirect: any }) {
    const router = useRouter();

    router.push(redirect);
    return (
        <>Pergi ke profile/edit</>
    )
}