import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import BuatKomponen from "../../../components/BuatSoal";
import { ApakahSudahMasuk } from "../../../lib/Servis";
import { IAkun } from "../../../types/tipe";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const session = await ApakahSudahMasuk(req, res);
    return session
}

export default function Buat({ Akun }: { Akun: IAkun }) {
    return (
        <>
            <Head>
                <title>Buat soal</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <BuatKomponen
                profile={Akun}
                mode="buat"
            />
        </>
    )
}