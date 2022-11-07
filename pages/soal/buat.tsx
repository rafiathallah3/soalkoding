import { Akun } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import BuatKomponen from "../../components/BuatSoal";
import { UpdateInfoAkun } from "../../services/Servis";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { redirect: string };
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    return {
        props: {
            profile: {
                username: DapatinUser.username,
                gambar: DapatinUser.gambarurl
            }
        }
    }
}

export default function Buat({ profile }: { profile: { username: string, gambar: string } }) {
    return (
        <BuatKomponen
            profile={profile}
            mode="buat"
        />
    )
}