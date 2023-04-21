import Head from "next/head";
import { useSession } from 'next-auth/react'
import { IAkun } from "../../types/tipe";
import Navbar from "../../components/navbar";
import { useEffect } from "react";

export default function TidakKetemu() {
    const { data: Akun } = useSession();

    return (
        <>
            <Head>
                <title>Tidak ketemu</title>
            </Head>
            {Akun ?
            <Navbar profile={{ username: Akun.user!.name!, gambar: Akun.user!.image! } as IAkun}></Navbar>
            :
            <Navbar profile={null}></Navbar>
            }
            <div style={{ minHeight: "90%" }}>
                <style>{`
                #__next {
                    height: 100%;
                }
                `}</style>
                <div className="d-flex align-items-center justify-content-center">
                    <div className="text-white fs-1 text-center">
                        400 + 4 Tidak ketemu
                        <p className="fs-3 text-white-50">Halaman yang kamu kunjungi itu tidak ada</p>
                    </div>
                </div>
            </div>
        </>
    )
}