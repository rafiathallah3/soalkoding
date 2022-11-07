import Image from "next/image";
import Link from "next/link";

export default function Navbar({ profile }: { profile: { username?: string, gambar?: string } }) {
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
            
            `}</style>
            <div className="container-fluid">
                <ul className="navbar-nav me-auto px-4 text-white">
                    <li className="navbar-nav align-self-center">
                        <Link href="/dashboard">
                            <a className="text-decoration-none text-white">Soalkoding</a>
                        </Link>
                    </li>
                </ul>
                <ul className={"navbar-nav ms-auto px-4 barangnavbar " + (Object.keys(profile).length === 0 ? 'p-2' : '')}>
                    {Object.keys(profile).length !== 0 ?
                        <>
                            <li className='nav-item me-4 align-self-center'>
                                <i className='bi bi-bell-fill text-white fs-3'></i>
                            </li>
                            <li className="nav-item dropdown-center">
                                <a className="nav-link d-flex align-items-center" id="navbarDropdownMenuLink" onClick={() => window.location = `/profile/${profile.username}` as any} role="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                    <Image src={profile.gambar === undefined || profile.gambar === "" ? "/gambar/profile.png" : profile.gambar} className="rounded text-white" height={45} width={45} alt="Potret seorang wanita cantik" />
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