import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import BuatKomponen from "../../components/BuatSoal";
import { UpdateInfoAkun } from "../../services/Servis";
import { HasilDapatinUser, TipeProfile } from "../../types/tipe";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as HasilDapatinUser;
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    return {
        props: {
            profile: DapatinUser.profile
        }
    }
}

export default function Buat({ profile }: { profile: TipeProfile }) {
    return (
        <>
            <Head>
                <title>Buat soal</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <BuatKomponen
                profile={profile}
                mode="buat"
            />
        </>
    )
}