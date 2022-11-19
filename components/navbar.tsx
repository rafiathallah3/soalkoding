import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Notifikasi, TipeProfile } from "../types/tipe";

export default function Navbar({ profile }: { profile: TipeProfile }) {
    const [DataNotifikasi, setDataNotifikasi] = useState<Notifikasi[]>(profile.notifikasi);
    const [BerapaNotifikasi, setBerapaNotifikasi] = useState<number>(profile.jumlahNotif);

    const DapatinNotifikasi = async () => {
        const HasilNotifikasi = await axios.get("/api/profile/dapatinNotifikasi").then(d => d.data);
        setDataNotifikasi(HasilNotifikasi.data);
        setBerapaNotifikasi(0);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <style jsx>{`
            .barangnavbar {
                background-color: transparent;
                transition: .2s;
            }

            .barangnavbar:hover {
                background-color: rgb(41, 41, 41)
            }

            .soalkoding {
                color: white;
            }
            
            .dropdown-center:hover .dropdown-menu {
                display: block;
                margin-top: 0;
                left: auto;
                right: 0;
            }

            .komponen-notifikasi:hover {
                background: rgb(50, 50, 50);
            }

            .donasi {
                color: white;
                transition: .2s;
            }

            .donasi:hover {
                color: #c92479;
            }

            .warna-discord {
                color: white;
                transition: .2s;
            }

            .warna-discord:hover {
                color: #7289da;
            }
            
            `}</style>
            <div className="container-fluid">
                <ul className="navbar-nav me-auto px-4 text-white">
                    <li className="navbar-nav align-self-center">
                        <Link href="/dashboard">
                            <a className="text-decoration-none text-white" style={{ fontSize: "17px" }}>Soalkoding</a>
                        </Link>
                    </li>
                </ul>
                <ul className={"navbar-nav ms-auto px-4 barangnavbar"}>
                    {!Object.values(profile).some((v) => v === null) ?
                        <>
                            <li className='nav-item me-4 align-self-center'>
                                <a href="https://discord.gg/kaqs2j4W">
                                    <i className='bi bi-discord fs-2 warna-discord'></i>
                                </a>
                            </li>
                            <li className='nav-item me-3 align-self-center'>
                                <Link href="/donasi">
                                    <a>
                                        <i className='bi bi-piggy-bank-fill donasi fs-2'></i>
                                    </a>
                                </Link>
                            </li>
                            <li role={"button"} className='nav-item align-self-center me-3'>
                                <a className="nav-link" id="navbarDropdownMenuLink" role="button" onClick={DapatinNotifikasi} data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                    {(BerapaNotifikasi >= 1) &&
                                        <span className="d-inline-block float-end align-bottom text-white text-center" style={{ background: "red", width: "20px", height: "20px", fontSize: "15px" }}>
                                            1
                                        </span>
                                    }
                                    <i className='bi bi-bell-fill text-white fs-2 d-inline-block'></i>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-sm-end py-3" style={{ width: "11%", right: "0.6rem", top: "4rem", backgroundColor: "rgb(41, 41, 41)", border: "0px solid black" }}>
                                    <h5 className="px-3">Notifikasi</h5>
                                    {DataNotifikasi?.map((v, i) => {
                                        return (
                                            <>
                                                <li className="p-2 w-100 komponen-notifikasi">
                                                    <div className="d-inline-block me-3 align-top" style={{ left: "5px", top: "10px", position: 'relative' }}>
                                                        <Image src={v.userDari.gambarurl} className="rounded text-white" height={45} width={45} alt="Potret seorang wanita cantik" />
                                                    </div>
                                                    <div className="d-inline-block align-middle" style={{ width: "75%" }}>
                                                        {v.konten}
                                                    </div>
                                                </li>
                                                {i >= 2 &&
                                                    <hr className="my-1" />
                                                }
                                            </>
                                        )
                                    })}
                                    {/* <li className="p-2 w-100 komponen-notifikasi">
                                        <div className="d-inline-block me-3 align-top" style={{ left: "5px", top: "10px", position: 'relative' }}>
                                            <Image src={profile.gambar === null || profile.gambar === "" ? "/gambar/profile.png" : profile.gambar} className="rounded text-white" height={45} width={45} alt="Potret seorang wanita cantik" />
                                        </div>
                                        <div className="d-inline-block align-middle" style={{ width: "75%" }}>
                                            Soal kamu 3 Angka Kalkulator mempunyai total 10 solusi user!
                                        </div>
                                    </li> */}
                                </ul>
                            </li>
                            <li className="nav-item dropdown-center">
                                <a className="nav-link d-flex align-items-center" id="navbarDropdownMenuLink" onClick={() => window.location = `/profile/${profile.username}` as any} role="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                    <Image src={profile.gambar === null || profile.gambar === "" ? "/gambar/profile.png" : profile.gambar} className="rounded text-white" height={45} width={45} alt="Potret seorang wanita cantik" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-sm-end" style={{ minWidth: "125px", backgroundColor: "rgb(41, 41, 41)", border: "0px solid black" }}>
                                    <li>
                                        <a className="dropdown-item" href={"/profile/" + profile.username}><i className='bi bi-person-circle'></i> My profile</a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href={"/profile/edit"}><i className='bi bi-gear-fill'></i> Settings</a>
                                    </li>
                                    <li>
                                        <hr className='dropdown-divider' style={{ borderColor: "rgb(102, 102, 102)" }} />
                                    </li>
                                    <li>
                                        <a className="dropdown-item" style={{ cursor: "pointer" }} onClick={() => { (document.getElementById('keluarakun') as HTMLFormElement).submit() }}> <i className='bi bi-arrow-left'></i> Logout </a>
                                        <form action="/api/logout" method='POST' id="keluarakun">
                                        </form>
                                    </li>
                                </ul>
                            </li>
                        </>
                        :
                        <>
                            <li className='nav-item me-1 align-self-center p-2'>
                                <Link href={'/login'}>
                                    <a className="text-decoration-none" style={{ padding: "6px", background: "rgb(48, 48, 48)", color: "white", border: '0px solid' }}>Masuk</a>
                                </Link>
                            </li>
                            <li className='nav-item me-1 align-self-center p-2'>
                                <Link href={'/register'}>
                                    <a className="text-decoration-none" style={{ padding: "6px", background: "rgb(48, 48, 48)", color: "white", border: '0px solid' }}>Register</a>
                                </Link>
                            </li>
                        </>
                    }
                </ul>
            </div>
        </nav>
    )
}