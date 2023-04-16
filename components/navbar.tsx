import Image from "next/image";
import Link from "next/link";
import { signOut } from 'next-auth/react';
import { IAkun } from "../types/tipe";

export default function Navbar({ profile }: { profile: { username: string, gambar: string } | null }) {
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
                        <Link href="/dashboard" className="text-decoration-none text-white" style={{ fontSize: "17px" }}>
                            Soalkoding
                        </Link>
                    </li>
                </ul>
                <ul className={"navbar-nav ms-auto px-4 barangnavbar"}>
                    {profile ?
                        <>
                            <li role={"button"} className='nav-item align-self-center me-3'>
                                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-sm-end py-3" style={{ width: "11%", right: "0.6rem", top: "4rem", backgroundColor: "rgb(41, 41, 41)", border: "0px solid black" }}>
                                    <li className="p-2 w-100">
                                        <div className="d-inline-block me-3 align-top" style={{ left: "5px", top: "10px", position: 'relative' }}>
                                            <Image src={profile.gambar === null || profile.gambar === "" ? "/gambar/profile.png" : profile.gambar} className="rounded text-white" height={45} width={45} alt="Potret seorang wanita cantik" />
                                        </div>
                                    </li>
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
                                        <a className="dropdown-item" style={{ cursor: "pointer" }} onClick={() => signOut({ callbackUrl: "/login" })}> <i className='bi bi-arrow-left'></i> Logout </a>
                                    </li>
                                </ul>
                            </li>
                        </>
                        :
                        <>
                            <li className='nav-item me-1 align-self-center p-2'>
                                <Link href={'/login'} className="text-decoration-none" style={{ padding: "6px", background: "rgb(48, 48, 48)", color: "white", border: '0px solid' }}>
                                    Masuk
                                </Link>
                            </li>
                            <li className='nav-item me-1 align-self-center p-2'>
                                <Link href={'/register'} className="text-decoration-none" style={{ padding: "6px", background: "rgb(48, 48, 48)", color: "white", border: '0px solid' }}>
                                    Register!
                                </Link>
                            </li>
                        </>
                    }
                </ul>
            </div>
        </nav>
    )
}