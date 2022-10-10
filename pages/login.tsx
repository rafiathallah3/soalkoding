import axios from 'axios';
import Link from 'next/link';
import { SyntheticEvent, useState } from 'react';
import Router from "next/router";
import Background from '../components/background';

export default function Login() {
    const [AdaError, setAdaError] = useState('');

    const KirimLogin = async (e: SyntheticEvent) => {
        e.preventDefault();
        setAdaError('');
        const { email, password } = e.target as any;
        const data: {kondisi: string} = await axios.post("/api/login", {
            email: email.value,
            password: password.value
        }).then(d => d.data);
        
        if(data.kondisi === "benar") {
            Router.push("/dashboard");
        } else {
            setAdaError('Password atau Email SALAH!');
        }
    }

    //next auth js
    return (
        <Background>
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5" style={{backgroundColor: "rgb(34, 35, 36)"}}>
                            <div className="card-body p-4 p-sm-5">
                                <h3 className="card-title text-center text-white mb-5">Soalkoding.com</h3>
                                <form onSubmit={KirimLogin}>
                                    <div className="form-floating mb-3">
                                        <input type="email" name='email' className="form-control border-secondary text-white" style={{backgroundColor: "rgb(43, 43, 43)"}} id="floatingEmail" placeholder="name@example.com" maxLength={30} required/>
                                        <label htmlFor="floatingEmail" style={{color: "grey"}}>Email</label>
                                    </div>
                                    <div className="form-floating mb-1">
                                        <input type="password" name='password' className="form-control border-secondary text-white" style={{backgroundColor: "rgb(43, 43, 43)"}} id="floatingPassword" placeholder="Password" maxLength={20} required/>
                                        <label htmlFor="floatingPassword" style={{color: "grey"}}>Password</label>
                                    </div>

                                    <div className="mb-3">
                                        <a href="" className='text-decoration-none' style={{color: "rgb(120, 120, 120)"}}>Lupa password?</a>
                                    </div>
                                    {AdaError !== '' &&
                                    <h5 className='text-danger text-center mb-4'>{AdaError}</h5>
                                    }
                                    <div className="d-grid">
                                        <input className="btn btn-success" type="submit" value={"Masuk"} />
                                    </div>
                                    <div className="mb-3">
                                        <p style={{color: "rgb(120, 120, 120)"}}>Tidak punya akun? <Link href="/register"><a style={{color: "rgb(120, 120, 120)"}}>Buat sekarang!</a></Link></p>
                                    </div>
                                    <hr className="my-4 text-white" />

                                    <div className="d-grid">
                                        <Link href={"https://github.com/login/oauth/authorize?client_id=25bed176db5b6ad0e239&scope=read:user%20user:email"}>
                                            <button className="btn btn-dark" style={{backgroundColor: "rgb(41, 41, 41)"}}>
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
        </Background>
    )
}