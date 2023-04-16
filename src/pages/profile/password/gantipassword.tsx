import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { ApakahSudahMasuk } from "../../../../lib/Servis";
import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { IAkun } from "../../../../types/tipe";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const session = await ApakahSudahMasuk(req, res);
    return session;
}

export default function GantiPassword({ Akun }: { Akun: IAkun }) {
    const [AdaError, setAdaError] = useState('');
    const router = useRouter();

    const SubmitPassword = async (e: SyntheticEvent) => {
        e.preventDefault();
        setAdaError('');
        const { passwordbaru, konfirmasipassword, password } = e.target as any;

        if(passwordbaru.value !== konfirmasipassword.value) {
            setAdaError("Password berbeda dengan konfirmasi!");
            return;
        }

        const data = await axios.post("/api/profile/password/gantipassword", {
            passwordbaru: passwordbaru.value,
            konfirmasipassword: konfirmasipassword.value,
            password: password.value
        }).then(d => d.data);

        if(data === "sukses") {
            router.push("/profile/"+Akun.username);
            return;
        }
        setAdaError(data);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                    <div className="card border-0 shadow rounded-3 my-5" style={{ backgroundColor: "rgb(34, 35, 36)" }}>
                        <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center text-white mb-5">Ganti password</h3>
                            <form onSubmit={SubmitPassword}>
                                <div className="form-floating mb-3">
                                    <input type="password" name='passwordbaru' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingPasswordBaru" placeholder="Password Baru" maxLength={30} required />
                                    <label htmlFor="floatingPasswordBaru" style={{ color: "grey" }}>Password baru</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" name='konfirmasipassword' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingKonfirmasiPassword" placeholder="Konfirmasi Password" maxLength={20} required />
                                    <label htmlFor="floatingKonfirmasiPassword" style={{ color: "grey" }}>Konfirmasi Password</label>
                                </div>
                                <div className="form-floating mb-4">
                                    <input type="password" name='password' className="form-control border-secondary text-white" style={{ backgroundColor: "rgb(43, 43, 43)" }} id="floatingPassword" placeholder="Password" maxLength={20} required />
                                    <label htmlFor="floatingPassword" style={{ color: "grey" }}>Password</label>
                                </div>

                                {AdaError !== '' &&
                                    <h5 className='text-danger text-center mb-4'>{AdaError}</h5>
                                }
                                <div className="d-grid">
                                    <input className="btn btn-success" type="submit" value={"Ganti Password"} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}