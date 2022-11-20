import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/navbar";
import { UpdateInfoAkun } from "../services/Servis";
import { HasilDapatinUser, TipeProfile } from "../types/tipe";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as HasilDapatinUser;

    return {
        props: {
            profile: DapatinUser.profile
        }
    }
}

export default function Donasi({ profile }: { profile: TipeProfile }) {
    return (
        <>
            <Head>
                <title>Donasi</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar profile={profile} />
            <div className="container">
                <div className="d-flex align-items-center justify-content-center flex-column" style={{ height: "50vh" }}>
                    <h1 className="text-white text-center">Donasi</h1>
                    <h4 className="text-white">Terima kasih atas yang berdonasi karena ini adalah project pertama saya yang diperlukan 3.5 bulan dalam pembuatan</h4>
                    <h4 className="text-white text-center">Saya senang sekali saat membuat project ini, banyak stress yang saya hadapin, bisa mendapatkan ilmu yang lebih luas, logika yang lumayan berkembang dan kamu juga bisa meningkatkan logikau kamu melalui mengerjakan soal soal yang ada di <Link href="/soal/cari"><a className="text-decoration-none">sini</a></Link></h4>
                    <br />
                    <h4 className="text-white">Saweria: <Link href="https://saweria.co/rafiathallah3"><a>Saweria</a></Link></h4>
                    <h4 className="text-white">Paypal: <Link href="https://paypal.me/rafiathallah404"><a>Paypal</a></Link></h4>
                    <br />
                    <h4 className="text-white">Sekali lagi, Terima kasih atas menggunakan website ini</h4>
                </div>
            </div>
        </>
    )
}