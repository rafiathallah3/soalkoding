import Image from "next/image"

export default function Navbar() {
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
            
            .dropdown-center:hover .dropdown-menu {
                display: block;
                margin-top: 0;
            }
            
            `}</style>
            <div className="container-fluid">
                <ul className="navbar-nav ms-auto px-4 barangnavbar">
                    <li className='nav-item me-4 align-self-center'>
                        <i className='bi bi-bell-fill text-white fs-3  '></i>
                    </li>
                    <li className="nav-item dropdown-center">
                        <a className="nav-link d-flex align-items-center" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                            <Image src="/profile.jpeg" className="rounded me-2 text-white" height={40} width={48} alt="Potret seorang wanita cantik" />
                            <h4 className='text-white text-center align-middle'>100</h4>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-sm-end" style={{minWidth: "125px", backgroundColor: "rgb(41, 41, 41)", border: "0px solid black"}}>
                            <li>
                                <a className="dropdown-item" href="#"><i className='bi bi-person-circle'></i> My profile</a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#"><i className='bi bi-gear-fill'></i> Settings</a>
                            </li>
                            <li>
                                <hr className='dropdown-divider' style={{borderColor: "rgb(102, 102, 102)"}}/>
                            </li>
                            <li>
                                <a className="dropdown-item" style={{cursor: "pointer"}} onClick={() => { (document.getElementById('keluarakun') as HTMLFormElement).submit() }}> <i className='bi bi-arrow-left'></i> Logout </a>
                                <form action="/api/logout" method='POST' id="keluarakun">
                                </form>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    )
}