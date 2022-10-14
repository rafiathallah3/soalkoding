import Navbar from "../../components/navbar"
import NextImage from "next/image";
import { useState } from "react";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { SettingProfile } from "../../types/tipe";
import prisma from "../../database/prisma";

export async function getServerSideProps(konteks: { params: { profile: string }, req: NextApiRequest }) {
    try {
        const data = await axios.post("http://localhost:3003/api/profile/dapatinProfile", {}, {
            headers: { cookie: konteks.req.headers.cookie } as any
        }).then(d => d.data);

        return {
            props: {
                data
            }
        }
    } catch (e) {
        return { notFound: true }
    }
}

export default function Edit({ data }: { data: SettingProfile }) {
    const [Gambar, setGambar] = useState();

    const UpdateProfile = async () => {
        if ((document.getElementById('foto')! as HTMLInputElement).files!.length <= 0) return;
        const formData = new FormData();
        // formData.append("")
        formData.append("file", (document.getElementById('foto')! as any).files[0]);

        try {
            const res = await axios({
                method: "post",
                url: "/api/profile/updateProfile",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log("data", res);
        } catch (e) {
            console.log(e);
        }

    }

    const GantiGambarProfile = () => {
        document.getElementById('foto')!.click();
    }

    const InputGantiProfil = () => {
        const [file]: [file: File] = (document.getElementById('foto')! as any).files;
        if (file) {
            if (parseFloat((file.size / (1024 * 1024)).toFixed(2)) < 1.5) {
                // (document.getElementById('Gambar')! as HTMLImageElement).src = URL.createObjectURL(file);
                // setGambar(URL.createObjectURL(file) as any);

                var reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = function (e) {
                    let gambar = new Image;
                    gambar.src = e.target!.result as any;
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d")!;

                    gambar.onload = function () {
                        ctx.drawImage(gambar, 0, 0, 300, 150);
                        var dataurl = canvas.toDataURL(file as any);
                        var head = 'data:image/png;base64,';
                        var imgFileSize = Math.round((dataurl.length - head.length) * 3 / 4);
                        console.log(parseFloat((imgFileSize / (1024 * 1024)).toFixed(2)));
                        setGambar(dataurl as any);
                    }
                }
            }
        }
    }

    return (
        <>
            <Navbar />
            <style>{`
            .gambarProfile:hover {
                cursor: pointer;
            }
            `}</style>
            <div className="container-xl">
                <div className="p-3 mb-3 rounded-2" style={{ background: "rgb(48, 48, 48)" }}>
                    <span className="text-white fs-5">Profile</span>
                    <div className="row p-2 mb-2">
                        <div className="col">
                            <div className="mb-1">
                                <div className="text-white mb-2">Nama</div>
                                <input defaultValue={data.name} className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                            </div>
                            <div className="mb-1">
                                <div className="text-white mb-2">Tinggal</div>
                                <input defaultValue={data.tinggal} className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                            </div>
                            <div className="mb-1">
                                <div className="text-white mb-2">Bio</div>
                                <textarea defaultValue={data.bio} className="form-control" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                            </div>
                            <div className="mb-1">
                                <div className="text-white mb-2">URL</div>
                                <input defaultValue={data.website} className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                            </div>
                        </div>
                        <div className="col-2">
                            <div>
                                <span className="mb-2 text-white">Gambar profile</span>
                                <input type="file" id="foto" accept="image/*" onChange={InputGantiProfil} hidden />
                                <NextImage className="rounded-1 gambarProfile" src={Gambar || "/profile.jpeg"} id="Gambar" width={200} height={200} alt="Profile kamu yang sangat keren, sepertinya" onClick={GantiGambarProfile} />
                                {/* <p style={{color: "#802520"}}>Ukuran gambar terlalu besar!</p> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-3 mb-3 rounded-2" style={{ backgroundColor: "rgb(48, 48, 48)" }}>
                    <span className="text-white fs-5">Akun</span>
                    <div className="p-2">
                        <div className="mb-2 w-100 row row-cols-2">
                            <div className="col mb-1">
                                <div className="text-white mb-2">Username</div>
                                <input defaultValue={data.username} className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                            </div>
                            <div className="col mb-1">
                                <div className="text-white mb-2">Email</div>
                                <input defaultValue={data.email} className="form-control" type="text" style={{ background: "rgb(40, 40, 40)", color: "rgb(200, 200, 200)", border: "1px solid rgb(100, 100, 100)" }} />
                            </div>
                        </div>
                    </div>
                    <span className="text-white fs-5">Social</span>
                    <div className="p-2">
                        <div className="d-flex flex-column">
                            <button className="mb-1 p-1 rounded-1 text-white text-center" style={{ backgroundColor: "rgb(40, 40, 40)", border: "1px solid rgb(100, 100, 100)" }}>
                                <i className="ms-2 bi bi-github"></i>
                                <span className="ms-2">Hubungkan ke github</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-3 mb-3 rounded-2" style={{ backgroundColor: "rgb(48, 48, 48)" }}>
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
                </div>
                <button className="rounded-1" onClick={UpdateProfile} style={{ backgroundColor: "rgb(100, 100, 100)", border: "0px solid transparent", color: "rgb(230, 230, 230)", width: "5rem", height: "2rem" }}>
                    UPDATE
                </button>
            </div>
        </>
    )
}