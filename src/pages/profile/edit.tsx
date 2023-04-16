import { NextApiRequest, NextApiResponse } from "next";
import { ApakahSudahMasuk } from "../../../lib/Servis";
import Head from "next/head";
import Navbar from "../../../components/navbar";
import { IAkun } from "../../../types/tipe";
import { useRouter } from 'next/router'
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const session = await ApakahSudahMasuk(req, res);
    return session
}

export default function Edit({ Akun }: { Akun: IAkun }) {
    const [FileDipilih, setFileDipilih] = useState<File | undefined>(undefined);
    const [Gambar, setGambar] = useState<string>(Akun.gambar || "/GambarProfile.jpg");
    const router = useRouter();

    useEffect(() => {
        if(!FileDipilih) {
            return;
        }

        const objectURL = URL.createObjectURL(FileDipilih);
        setGambar(objectURL);
        
        return () => URL.revokeObjectURL(objectURL);
    }, [FileDipilih]);

    const PilihFile = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files || e.target.files.length === 0) {
            setFileDipilih(undefined);
            return;
        }

        setFileDipilih(e.target.files[0]);
    }

    const KirimProfile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        for(const i of (e.target as unknown as HTMLInputElement[])){ 
            formData.append(i.name, i.value);
        }
        if(FileDipilih) {
            formData.set("foto", FileDipilih);
        }

        const { data } = await axios({
            url: "/api/profile/updateProfile",
            method: "post",
            data: formData,
        });

        if(data === "sukses") {
            setTimeout(() => {
                router.reload();
            }, 800);
        }
    }

    return (
        <>
            <Head>
                <title>Edit profile</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar profile={Akun} />
            <style>{`
            .gambarProfile:hover {
                cursor: pointer;
            }
            `}</style>
            <div className="container-xl">
                <form onSubmit={KirimProfile} method="POST">
                    <fieldset>
                        <div className="p-3 mb-3 rounded-2" style={{ background: "rgb(48, 48, 48)" }}>
                            <span className="text-white fs-5">Profile</span>
                            <div className="row p-2 mb-2">
                                <div className="col">
                                    <div className="mb-1">
                                        <div className="text-white mb-2">Nama</div>
                                        <input defaultValue={Akun.nama} name="nama" className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                                    </div>
                                    <div className="mb-1">
                                        <div className="text-white mb-2">Tinggal</div>
                                        <input defaultValue={Akun.tinggal} name="tinggal" className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                                    </div>
                                    <div className="mb-1">
                                        <div className="text-white mb-2">Bio</div>
                                        <textarea defaultValue={Akun.bio} name="bio" className="form-control" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                                    </div>
                                    <div className="mb-1">
                                        <div className="text-white mb-2">Website</div>
                                        <input defaultValue={Akun.website} name="website" className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div>
                                        <span className="mb-2 text-white">Gambar</span>
                                        <input type="file" id="foto" name="foto" accept="image/*" onChange={PilihFile} hidden />
                                        <Image className="rounded-1 gambarProfile" src={Gambar} id="Gambar" width={200} height={200} alt="Profile kamu yang sangat keren, sepertinya" onClick={() => document.getElementById("foto")!.click()} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div className="p-3 mb-3 rounded-2" style={{ backgroundColor: "rgb(48, 48, 48)" }}>
                            <span className="text-white fs-5">Akun</span>
                            <div className="p-2 mb-3">
                                <div className="mb-3 w-100 row g-3">
                                    <div className="col-md-6 mb-1">
                                        <div className="text-white mb-2">Username</div>
                                        <input defaultValue={Akun.username} name="username" className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                                    </div>
                                    <div className="col-md-6 mb-1">
                                        <div className="text-white mb-2">
                                            <span className="me-2">Email</span>
                                            {/* {data.sudahVerifikasi ?
                                                <i title="Email sudah terverifikasi" className="bi bi-check-lg" style={{ color: "#32a852" }}></i>
                                                :
                                                <button style={{ background: "#3264a8", color: "white", border: "0px solid", padding: "0px 10px 0px 10px" }}>Verifikasi</button>
                                            } */}
                                        </div>
                                        <input defaultValue={Akun.email} name="email" className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                                    </div>
                                </div>
                                <a href={'/profile/password/gantipassword'} className="p-2 text-decoration-none rounded-1 text-white" style={{ backgroundColor: "rgb(40, 40, 40)", border: "1px solid rgb(100, 100, 100)" }}>Ganti Password</a>
                            </div>
                            {/* <span className="text-white fs-5">Social</span>
                            <div className="p-2">
                                <div className="d-flex flex-column">
                                    {!Akun.MasukDenganGithub ?
                                        <button type="button" onClick={() => signIn('github', { redirect: false }).then((d) => { console.log(d?.error) })} className="mb-1 p-1 rounded-1 text-white text-center" style={{ backgroundColor: "rgb(40, 40, 40)", border: "1px solid rgb(100, 100, 100)", width: "100%" }}>
                                            <i className="ms-2 bi bi-github"></i>
                                            <span className="ms-2">Hubungkan ke Github</span>
                                        </button>
                                        :
                                        <div className="btn-group">
                                            <div className="me-3 p-1 w-100 rounded-1 text-white text-center" style={{ backgroundColor: "rgb(40, 40, 40)", border: "1px solid rgb(100, 100, 100)" }}>
                                                <i className="ms-2 bi bi-github"></i>
                                                <span className="ms-2">Github sudah terhubung</span>
                                            </div>
                                            <Link href={'/profile/github/putusin'}>
                                                <button className="p-1 w-25 rounded-1 text-white text-center" style={{ backgroundColor: "rgb(40, 40, 40)", border: "1px solid rgb(100, 100, 100)" }}>Putuskan github</button>
                                            </Link>
                                        </div>
                                    }
                                </div>
                            </div> */}
                        </div>
                    </fieldset>
                    <input type="submit" value={"UPDATE"} className="rounded-1 me-3" style={{ backgroundColor: "rgb(100, 100, 100)", border: "0px solid transparent", color: "rgb(230, 230, 230)", width: "5rem", height: "2rem" }} />
                    <button className="rounded-1" onClick={() => router.push("/profile/"+Akun.username)} style={{ backgroundColor: "rgb(176, 18, 49)", border: "0px solid transparent", color: "rgb(230, 230, 230)", width: "5rem", height: "2rem" }}>Kembali</button>
                </form>
            </div >
        </>
    )
}