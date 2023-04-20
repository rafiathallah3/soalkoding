import Link from "next/link";
import axios from 'axios';
import { SyntheticEvent, useState } from "react";
import Router from "next/router";
import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import { signIn } from "next-auth/react";
import { ApakahSudahMasuk } from "../../lib/Servis";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const session = await ApakahSudahMasuk(req, res);
    if(session.props) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            }
        }
    }

    return {
        props: {}
    }
}

export default function Register() {
    const [AdaError, setAdaError] = useState('');
    const [Akun, setAkun] = useState<{ email: string, username: string, password: string }>({ email: "", username: "", password: "" });

    const KumpulinData = async (e: SyntheticEvent) => {
        e.preventDefault();
        setAdaError('');

        if(Akun.password && Akun.email && Akun.username) {
            try {
                const data = await axios.post("/api/register", Akun).then(d => d.data);
    
                if(data.kondisi === "sukses")
                    Router.push('/login');
                if(data.kondisi === "error")
                    setAdaError(data.pesan);
            } catch(e) {
                setAdaError("Ada terjadi kesalah, mohon coba lagi");
            }
        }
    }

    const MasukDenganGithub = async () => {
        signIn("github", { callbackUrl: `/dashboard` });
    }

    return (
        <>
            <Head>
                <title>Register</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5" style={{ backgroundColor: "rgb(34, 35, 36)" }}>
                            <div className="card-body p-4 p-sm-5">
                                <h3 className="card-title text-center text-white mb-5">Soalkoding</h3>
                                <div className="form-floating mb-3">
                                    <input type="email" value={Akun.email} onChange={(e) => setAkun({ ...Akun, email: e.target.value })} name='email' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingInput" placeholder="name@example.com" maxLength={30} required />
                                    <label htmlFor="floatingInput" style={{ color: "grey" }}>Email</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="text" value={Akun.username} onChange={(e) => setAkun({ ...Akun, username: e.target.value })} name='username' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingEmail" placeholder="Username" minLength={8} maxLength={15} required />
                                    <label htmlFor="floatingEmail" style={{ color: "grey" }}>Username</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="password" value={Akun.password} onChange={(e) => setAkun({ ...Akun, password: e.target.value })} name='password' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingPassword" placeholder="Password" minLength={8} maxLength={20} required />
                                    <label htmlFor="floatingPassword" style={{ color: "grey" }}>Password</label>
                                </div>

                                {AdaError !== "" &&
                                    <h5 className="text-danger text-center mb-4">{AdaError}</h5>
                                }

                                <div className="d-grid">
                                    <input className="btn btn-success" type="submit" value={"Buat"} onClick={KumpulinData} />
                                </div>

                                <div className="mb-3">
                                    <p style={{ color: "rgb(120, 120, 120)" }}>Sudah punya akun? <Link href="/login" style={{ color: "rgb(120, 120, 120)" }}>Masuk!</Link></p>
                                </div>
                                <hr className="my-4 text-white" />

                                <div className="d-grid">
                                    <button onClick={MasukDenganGithub} className="btn btn-dark" style={{ backgroundColor: "rgb(41, 41, 41)" }}>
                                        <i className="bi bi-github"></i> Masuk dengan GitHub
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}