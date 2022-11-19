import Navbar from "../../components/navbar"
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { SettingProfile, TipeProfile } from "../../types/tipe";
import Link from "next/link";
import { UpdateInfoAkun } from '../../services/Servis';
import { Akun } from "@prisma/client";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { redirect: string };
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    try {
        const data = await axios.post("http://localhost:3003/api/profile/dapatinProfile", {}, {
            headers: { cookie: req.headers.cookie } as any
        }).then(d => d.data);

        return {
            props: {
                data,
                profile: {
                    username: data.username ?? null,
                    gambar: data.gambarurl ?? null,
                }
            }
        }
    } catch (e) {
        return { notFound: true }
    }
}

export default function Edit({ data, profile }: { data: SettingProfile, profile: TipeProfile }) {
    const [Notif, setNotif] = useState<{ status: string, pesan: string } | undefined>(undefined);

    useEffect(() => {
        setNotif(!getCookie('notif') ? undefined : JSON.parse(getCookie('notif') as string))
    }, [])
    // const [Gambar, setGambar] = useState();

    // const UpdateProfile = async () => {
    //     console.log("Pencet update profile")
    //     if ((document.getElementById('foto')! as HTMLInputElement).files!.length <= 0) return;
    //     const formData = new FormData();
    //     // formData.append("")
    //     formData.append("file", (document.getElementById('foto')! as any).files[0]);
    //     formData.append("nama", "Muhammad Rafi athallah");

    //     try {
    //         // axios({
    //         //     method: "post",
    //         //     url: "/api/profile/updateProfile",
    //         //     data: {},
    //         //     headers: { "Content-Type": "multipart/form-data" }
    //         // }).then((res) => {
    //         //     console.log(res);
    //         // });
    //         // console.log("data", res);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    // const GantiGambarProfile = () => {
    //     document.getElementById('foto')!.click();
    // }

    // const InputGantiProfil = () => {
    //     const [file]: [file: File] = (document.getElementById('foto')! as any).files;
    //     if (file) {
    //         if (parseFloat((file.size / (1024 * 1024)).toFixed(2)) < 1.5) {
    //             // (document.getElementById('Gambar')! as HTMLImageElement).src = URL.createObjectURL(file);
    //             // setGambar(URL.createObjectURL(file) as any);

    //             var reader = new FileReader();
    //             reader.readAsDataURL(file);

    //             reader.onload = function (e) {
    //                 let gambar = new Image;
    //                 gambar.src = e.target!.result as any;
    //                 var canvas = document.createElement("canvas");
    //                 var ctx = canvas.getContext("2d")!;

    //                 gambar.onload = function () {
    //                     ctx.drawImage(gambar, 0, 0, 300, 150);
    //                     var dataurl = canvas.toDataURL(file as any);
    //                     var head = 'data:image/png;base64,';
    //                     var imgFileSize = Math.round((dataurl.length - head.length) * 3 / 4);
    //                     console.log(parseFloat((imgFileSize / (1024 * 1024)).toFixed(2)));
    //                     setGambar(dataurl as any);
    //                 }
    //             }
    //         }
    //     }
    // }

    return (
        <>
            <Navbar profile={profile} />
            <style>{`
            .gambarProfile:hover {
                cursor: pointer;
            }
            `}</style>
            <div className="container-xl">
                {Notif &&
                    <div className="mb-2 text-white p-2" style={{ background: `${Notif.status}` }}>{Notif.pesan}</div>
                }
                <form action="/api/profile/updateProfile" method="POST">
                    <fieldset>
                        <div className="p-3 mb-3 rounded-2" style={{ background: "rgb(48, 48, 48)" }}>
                            <span className="text-white fs-5">Profile</span>
                            <div className="row p-2 mb-2">
                                <div className="col">
                                    <div className="mb-1">
                                        <div className="text-white mb-2">Nama</div>
                                        <input defaultValue={data.nama} name="nama" className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                                    </div>
                                    <div className="mb-1">
                                        <div className="text-white mb-2">Tinggal</div>
                                        <input defaultValue={data.tinggal} name="tinggal" className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                                    </div>
                                    <div className="mb-1">
                                        <div className="text-white mb-2">Bio</div>
                                        <textarea defaultValue={data.bio} name="bio" className="form-control" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                                    </div>
                                    <div className="mb-1">
                                        <div className="text-white mb-2">URL</div>
                                        <input defaultValue={data.website} name="website" className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                                    </div>
                                </div>
                                {/* <div className="col-2">
                            <div>
                                <span className="mb-2 text-white">Gambar profile</span>
                                <input type="file" id="foto" accept="image/*" onChange={InputGantiProfil} hidden />
                                <NextImage className="rounded-1 gambarProfile" src={Gambar || "/profile.jpeg"} id="Gambar" width={200} height={200} alt="Profile kamu yang sangat keren, sepertinya" onClick={GantiGambarProfile} />
                                <p style={{color: "#802520"}}>Ukuran gambar terlalu besar!</p>
                            </div>
                        </div> */}
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
                                        <input defaultValue={data.username} name="username" className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
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
                                        <input defaultValue={data.email} name="email" className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                                    </div>
                                </div>
                                <a href={'/profile/password/gantipassword'} className="p-2 text-decoration-none rounded-1 text-white" style={{ backgroundColor: "rgb(40, 40, 40)", border: "1px solid rgb(100, 100, 100)" }}>Ganti Password</a>
                            </div>
                            <span className="text-white fs-5">Social</span>
                            <div className="p-2">
                                <div className="d-flex flex-column">
                                    {!data.akungithub ?
                                        <Link href={`/profile/github/hubungin`}>
                                            <button type="button" className="mb-1 p-1 rounded-1 text-white text-center" style={{ backgroundColor: "rgb(40, 40, 40)", border: "1px solid rgb(100, 100, 100)" }}>
                                                <i className="ms-2 bi bi-github"></i>
                                                <span className="ms-2">Hubungkan ke github</span>
                                            </button>
                                        </Link>
                                        :
                                        <div className="btn-group">
                                            <div className="me-3 p-1 w-100 rounded-1 text-white text-center" style={{ backgroundColor: "rgb(40, 40, 40)", border: "1px solid rgb(100, 100, 100)" }}>
                                                <i className="ms-2 bi bi-github"></i>
                                                <span className="ms-2">Github sudah terhubung dengan username {data.akungithub.username}</span>
                                            </div>
                                            <Link href={'/profile/github/putusin'}>
                                                <button className="p-1 w-25 rounded-1 text-white text-center" style={{ backgroundColor: "rgb(40, 40, 40)", border: "1px solid rgb(100, 100, 100)" }}>Putuskan github</button>
                                            </Link>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <input type="submit" value={"UPDATE"} className="rounded-1" style={{ backgroundColor: "rgb(100, 100, 100)", border: "0px solid transparent", color: "rgb(230, 230, 230)", width: "5rem", height: "2rem" }} />
                </form>
                {/* <div className="p-3 mb-3 rounded-2" style={{ backgroundColor: "rgb(48, 48, 48)" }}>
                    <span className="text-white fs-5">Password</span>
                    <div className="p-2">
                        <div className="w-100 row row-cols-2">
                            <div className="col mb-1">
                                <div className="text-white mb-2">Password Baru</div>
                                <input className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                            </div>
                            <div className="col mb-1">
                                <div className="text-white mb-2">Konfirmasi Password</div>
                                <input className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <div className="d-flex flex-column">
                            <div className="mb-1 p-1 rounded-1 text-white">
                                <div className="text-white mb-2">Password (Biarin kosong kalau tidak mau mengganti password)</div>
                                <input className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                            </div>
                        </div>
                    </div>
                </div> */}
            </div >
        </>
    )
}