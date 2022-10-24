import { prisma } from "../../database/prisma"
import { getCookie } from "cookies-next"
import { NextApiRequest, NextApiResponse } from "next";
import { decrypt } from "../../database/UbahKeHash";
import { deleteCookie } from "cookies-next";
import jwt from 'jsonwebtoken';
import { useEffect, useState } from "react";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const infoakun = getCookie('infoakun', { req, res }) as string;
    if (infoakun === undefined) return { redirect: { destination: '/login', permanent: false } };

    const DataUser = await prisma.akun.findUnique({
        where: {
            id: JSON.parse(decrypt((jwt.verify(infoakun, process.env.TOKENRAHASIA!) as any).datanya)).id
        },
        include: {
            akungithub: {
                select: { email: true, username: true }
            }
        }
    });

    if (DataUser === null) {
        deleteCookie('infoakun', { req, res });
        deleteCookie('perbaruitoken', { req, res });
        return { redirect: { destination: '/login', permanent: false } }
    }
    if (DataUser.username !== "" || DataUser.email !== "") return { redirect: { destination: '/dashboard', permanent: false } }

    return {
        props: {
            ...DataUser.akungithub
        }
    }
}

export default function DaftarGithub({ email, username }: { email: string, username: string }) {
    const [Notif, setNotif] = useState<{ status: string, pesan: string } | undefined>(undefined);

    useEffect(() => {
        setNotif(!getCookie('notif') ? undefined : JSON.parse(getCookie('notif') as string))
    }, [])

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                    <div className="card border-0 shadow rounded-3 my-5" style={{ backgroundColor: "rgb(34, 35, 36)" }}>
                        <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center text-white mb-5">Soalkoding.com</h3>
                            <form method="POST" action="/api/auth/daftargithub">
                                <div className="form-floating mb-3">
                                    <input type="email" name='email' defaultValue={email} className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingInput" placeholder="name@example.com" maxLength={30} required />
                                    <label htmlFor="floatingInput" style={{ color: "grey" }}>Email</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="text" name='username' defaultValue={username} className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingEmail" placeholder="Username" minLength={8} maxLength={15} required />
                                    <label htmlFor="floatingEmail" style={{ color: "grey" }}>Username</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="password" name='password' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingPassword" placeholder="Password" minLength={8} maxLength={20} required />
                                    <label htmlFor="floatingPassword" style={{ color: "grey" }}>Password</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="password" name='konfirmasipassword' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingKonfirmasiPassword" placeholder="Password" minLength={8} maxLength={20} required />
                                    <label htmlFor="floatingKonfirmasiPassword" style={{ color: "grey" }}>Konfirmasi password</label>
                                </div>

                                {Notif !== undefined &&
                                    <h5 className="text-danger text-center mb-4">{Notif.pesan}</h5>
                                }

                                <div className="d-grid">
                                    <input className="btn btn-success" type="submit" value={"Buat"} />
                                </div>

                                <hr className="my-4 text-white" />

                                <div className="d-grid">
                                    <div className="btn btn-dark" style={{ backgroundColor: "rgb(41, 41, 41)" }}>
                                        <i className="bi bi-github"></i> Sudah terhubung: rafiathallah3
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}