import axios from 'axios';
import Link from 'next/link';
import { SyntheticEvent, useEffect, useState } from 'react';
import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import Head from 'next/head';
import { useRouter } from 'next/router';

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const infoakun = getCookie('infoakun', { req, res }) as string;
    if (infoakun !== undefined) return { redirect: { destination: '/dashboard', permanent: false } };

    return {
        props: {}
    }
}

export default function Login() {
    const [AdaError, setAdaError] = useState('');
    const router = useRouter();

    const KirimLogin = async (e: SyntheticEvent) => {
        e.preventDefault();
        setAdaError('');
        const { email, password } = e.target as any;
        const data = await axios.post("/api/login", {
            email: email.value,
            password: password.value
        }).then(d => d.data);

        console.log("login status", data);
        if (data === "benar") {
            router.push("/dashboard");
        } else {
            setAdaError('Password atau Email SALAH!');
        }
    }

    useEffect(() => {
        setAdaError(!getCookie('notif') ? undefined : JSON.parse(getCookie('notif') as string).pesan)
    }, []);

    //next auth js, Ide buruk 13/11/2022 17:16
    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5" style={{ backgroundColor: "rgb(34, 35, 36)" }}>
                            <div className="card-body p-4 p-sm-5">
                                <h3 className="card-title text-center text-white mb-5">Soalkoding.com</h3>
                                <form onSubmit={KirimLogin}>
                                    <div className="form-floating mb-3">
                                        <input type="email" name='email' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingEmail" placeholder="name@example.com" maxLength={30} required />
                                        <label htmlFor="floatingEmail" style={{ color: "grey" }}>Email</label>
                                    </div>
                                    <div className="form-floating mb-1">
                                        <input type="password" name='password' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingPassword" placeholder="Password" maxLength={20} required />
                                        <label htmlFor="floatingPassword" style={{ color: "grey" }}>Password</label>
                                    </div>

                                    <div className="mb-3">
                                        <a href="" className='text-decoration-none' style={{ color: "rgb(120, 120, 120)" }}>Lupa password?</a>
                                    </div>
                                    {AdaError !== '' &&
                                        <h5 className='text-danger text-center mb-4'>{AdaError}</h5>
                                    }
                                    <div className="d-grid">
                                        <input className="btn btn-success" type="submit" value={"Masuk"} />
                                    </div>
                                    <div className="mb-3">
                                        <p style={{ color: "rgb(120, 120, 120)" }}>Tidak punya akun? <Link href="/register"><a style={{ color: "rgb(120, 120, 120)" }}>Buat sekarang!</a></Link></p>
                                    </div>
                                    <hr className="my-4 text-white" />

                                    <div className="d-grid">
                                        <Link href={"/profile/github/hubungin"}>
                                            <button className="btn btn-dark" style={{ backgroundColor: "rgb(41, 41, 41)" }}>
                                                <i className="bi bi-github"></i> Masuk dengan GitHub
                                            </button>
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}