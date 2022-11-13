import Link from "next/link";
import axios from 'axios';
import { SyntheticEvent, useState } from "react";
import Router from "next/router";

export default function Register() {
    const [AdaError, setAdaError] = useState('');

    const KumpulinData = async (e: SyntheticEvent) => {
        e.preventDefault();
        setAdaError('');
        const { username, email, password } = e.target as any;

        try {
            const data = await axios.post("/api/register", {
                username: username.value,
                email: email.value,
                password: password.value
            }).then(d => d.data);

            if (data.kondisi === "sukses")
                Router.push('/login');
        } catch ({ response }) {
            setAdaError((response as any).data);
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                    <div className="card border-0 shadow rounded-3 my-5" style={{ backgroundColor: "rgb(34, 35, 36)" }}>
                        <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center text-white mb-5">Soalkoding.com</h3>
                            <form onSubmit={KumpulinData}>
                                <div className="form-floating mb-3">
                                    <input type="email" name='email' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingInput" placeholder="name@example.com" maxLength={30} required />
                                    <label htmlFor="floatingInput" style={{ color: "grey" }}>Email</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="text" name='username' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingEmail" placeholder="Username" minLength={8} maxLength={15} required />
                                    <label htmlFor="floatingEmail" style={{ color: "grey" }}>Username</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="password" name='password' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingPassword" placeholder="Password" minLength={8} maxLength={20} required />
                                    <label htmlFor="floatingPassword" style={{ color: "grey" }}>Password</label>
                                </div>

                                {AdaError !== "" &&
                                    <h5 className="text-danger text-center mb-4">{AdaError}</h5>
                                }

                                <div className="d-grid">
                                    <input className="btn btn-success" type="submit" value={"Masuk"} />
                                </div>

                                <div className="mb-3">
                                    <p style={{ color: "rgb(120, 120, 120)" }}>Sudah punya akun? <Link href="/login"><a style={{ color: "rgb(120, 120, 120)" }}>Masuk!</a></Link></p>
                                </div>
                                <hr className="my-4 text-white" />

                                <div className="d-grid">
                                    <button className="btn btn-dark" style={{ backgroundColor: "rgb(41, 41, 41)" }}>
                                        <i className="bi bi-github"></i> Masuk dengan GitHub
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}