import { NextApiRequest, NextApiResponse } from "next";
import { ApakahSudahMasuk, SemenjakWaktu } from "../../../lib/Servis";
import Head from "next/head";
import Navbar from "../../../components/navbar";
import axios from "axios";
import { IAkun, ISoal, WarnaAkun } from "../../../types/tipe";
import { useState } from "react";
import { DataModel } from "../../../lib/Model";
import Image from 'next/image';

export async function getServerSideProps({ params, req, res }: { params: { profile: string }, req: NextApiRequest, res: NextApiResponse }) {
    const session = await ApakahSudahMasuk(req, res);
    
    const DataProfile = await DataModel.AkunModel.findOne({ username: params.profile })
        .populate({path: "favorit", populate: { path: "user" }})
        .populate({path: "favorit", populate: { path: "soal" }})
        .populate({path: "soalselesai", populate: { path: "soal" }}) as IAkun || null;

    if(!DataProfile) {
        return {
            notFound: true
        }
    }

    let ParseDataProfile = JSON.parse(JSON.stringify(DataProfile)) as IAkun & { soaldibuat: ISoal[] };
    const SoalDibuat = JSON.parse(JSON.stringify(await DataModel.SoalModel.find({ pembuat: DataProfile._id })));
    ParseDataProfile.soaldibuat = SoalDibuat
    ParseDataProfile = {...ParseDataProfile, 
        soalselesai: ParseDataProfile.soalselesai.map((v) => ({...v, createdAt: SemenjakWaktu(new Date(v.createdAt))})),
        soaldibuat: ParseDataProfile.soaldibuat.map((v) => ({...v, createdAt: SemenjakWaktu(new Date(v.createdAt))}))
    }

    return {
        props: {
            DataProfile: ParseDataProfile,
            Akun: session.props?.Akun ?? null
        }
    }
}

export default function Profile({ DataProfile, Akun }: { DataProfile: IAkun & { soaldibuat: ISoal[] }, Akun: IAkun | null }) {
    const [StatusTable, setStatusTable] = useState<"soalselesai" | "solusi" | "favorit" | "soaldibuat">('soalselesai');

    const namaBulan = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const JadikanModerator = async (username: string) => {
        await axios.post("/api/profile/moderator", {
            username
        });

        window.location.reload();
    }

    const Title = `Profile ${DataProfile.username}`;
    return (
        <>
            <Head>
                <title>{Title}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar profile={Akun} />
            <div className="container">
                <div className="row">
                    <style jsx>{`
                    .tombol-table-aktif {
                        padding: 10px 15px 10px 15px;
                        margin-right: 10px;
                        font-size: 17px;
                        color: white;
                        background: rgb(70, 70, 70);
                        border: 0px solid;
                        border-radius: 4px;
                    }
                    .tombol-table {
                        padding: 10px 15px 10px 15px;
                        margin-right: 10px;
                        font-size: 17px;
                        color: rgb(180, 180, 180);
                        background: transparent;
                        border: 0px solid;
                        transition: .2s;
                    }
                    .tombol-table:hover {
                        color: white;
                    }
                    `}</style>
                    {/* {InformasiDariUpdate !== undefined &&
                        <div className="text-white mb-3 p-2" style={{ background: "#296331" }}>{InformasiDariUpdate}</div>
                    } */}
                    <div className="col-3 rounded-1 p-3" style={{ background: "rgb(45, 45, 45)", border: "1px solid rgb(61, 61, 61)" }}>
                        <div className="d-flex flex-column text-white mb-2 mt-2">
                            <div className="d-flex">
                                <div className="d-flex flex-shrink-0 position-relative me-3" style={{ height: "5rem", width: "5rem" }}>
                                    <div className="w-100 h-100 position-relative">
                                        <Image src={DataProfile.gambar} className="rounded-3 text-white" layout="fill" alt="Potret seorang wanita cantik" />
                                    </div>
                                </div>
                                <div className="d-flex flex-column">
                                    <h5>{DataProfile.username}</h5>
                                    <p className="text-white-50 m-0">{DataProfile.nama}</p>
                                    {DataProfile.admin ?
                                        <h6 className="m-0" style={{ color: WarnaAkun.admin }}>Admin</h6>
                                        : DataProfile.moderator ?
                                            <h6 className="m-0" style={{ color: WarnaAkun.moderator }}>Moderator</h6>
                                            : <></>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <p className="text-white-50 mb-1">Member sejak</p>
                            <p className="text-white">{`${namaBulan[new Date(DataProfile.createdAt).getMonth()]} ${new Date(DataProfile.createdAt).getFullYear()}`}</p>
                        </div>
                        {DataProfile.tinggal &&
                            <div className="mb-3">
                                <p className="text-white-50 mb-1">Saya tinggal di</p>
                                <p className="text-white">{DataProfile.tinggal}</p>
                            </div>
                        }
                        {DataProfile.bio &&
                            <div className="mb-3">
                                <p className="text-white-50 mb-1">Tentang Saya</p>
                                <p className="text-white">{DataProfile.bio}</p>
                            </div>
                        }
                        <div className="mb-3">
                            {DataProfile.githuburl &&
                                <a href={DataProfile.githuburl} target={"_blank"} rel="noopener noreferrer" title="Github Link" className="text-white fs-4 me-3">
                                    <i className="bi bi-github"></i>
                                </a>
                            }
                            {DataProfile.website &&
                                <a href={DataProfile.website} target={"_blank"} rel="noopener noreferrer" title="Website" className="text-white fs-4 me-3">
                                    <i className="bi bi-globe2"></i>
                                </a>
                            }
                            {(Akun?.admin && !DataProfile.admin) &&
                                <>
                                    {DataProfile.moderator ?
                                        <button className="btn btn-danger" onClick={() => JadikanModerator(DataProfile.username)}>Turunin moderator</button>
                                        :
                                        <button className="btn btn-success" onClick={() => JadikanModerator(DataProfile.username)}>Jadikan moderator</button>
                                    }
                                </>
                            }
                        </div>
                        <a href={"/profile/edit"} className="btn btn-dark form-control">
                            Edit Profile
                        </a>
                        <br />
                        <hr className="text-white" />
                        <div className="text-white fs-5">Soal sudah dikerjakan: {DataProfile.soalselesai.length}</div>
                        <div className='text-success me-5 fs-5'>Level 1 - 2: {DataProfile.soalselesai.filter(({ soal }) => soal.level <= 2).length}</div>
                        <div className='text-warning me-5 fs-5'>Level 3 - 4: {DataProfile.soalselesai.filter(({ soal }) => soal.level > 2 && soal.level <= 4).length}</div>
                        <div className='text-danger fs-5'>Level 5: {DataProfile.soalselesai.filter(({ soal }) => soal.level === 5).length}</div>
                    </div>
                    <div className="col-9">
                        <div className="p-3 text-white rounded-3" style={{ background: "rgb(45, 45, 45)", border: "1px solid rgb(61, 61, 61)" }}>
                            <div className="mb-3">
                                <button id="tombolsoalselesai" className={StatusTable === "soalselesai" ? "tombol-table-aktif" : "tombol-table"} onClick={() => setStatusTable("soalselesai")}>Soal selesai</button>
                                <button id="tombolsolusi" className={StatusTable === "solusi" ? "tombol-table-aktif" : "tombol-table"} onClick={() => setStatusTable("solusi")}>Solusi</button>
                                <button id="tombolfavorit" className={StatusTable === "favorit" ? "tombol-table-aktif" : "tombol-table"} onClick={() => setStatusTable("favorit")}>Favorit</button>
                                <button id="tombolsoaldibuat" className={StatusTable === "soaldibuat" ? "tombol-table-aktif" : "tombol-table"} onClick={() => setStatusTable("soaldibuat")}>Soal Dibuat</button>
                            </div>
                            {StatusTable === "soalselesai" &&
                                <div className="d-flex flex-column">
                                    {DataProfile.soalselesai.length <= 0 ?
                                        <div className="text-center fs-5">{DataProfile.username} tidak pernah menyelesaikan satu soal</div>
                                        :
                                        <>
                                            {DataProfile.soalselesai.filter((v, i, a) => i === a.findIndex((t) => t.soal._id.toString() === v.soal._id.toString())).map((v, i) => {
                                                return (
                                                    <div key={i} className="p-3" style={{ fontSize: "17px", backgroundColor: i % 2 == 0 ? "#2e2e2e" : "#3b3b3b" }}>
                                                        <a className="text-white text-decoration-none" href={`/soal/${v.soal._id}/latihan`}>{v.soal.namasoal}</a>
                                                        <span className="float-end text-white-50">{v.createdAt}</span>
                                                    </div>
                                                )
                                            }).reverse()}
                                        </>
                                    }
                                    {/* {DataProfile.soalselesai.filter((v, i, a) => i === a.findIndex((t) => t.soal.id === v.soal.id)).length <= 0 ?
                                        <div className="text-center fs-5">{DataProfile.username} tidak pernah menyelesaikan satu soal</div>
                                        :
                                        <>
                                            {DataProfile.soalselesai.filter((v, i, a) => i === a.findIndex((t) => t.soal.id === v.soal.id)).map((v, i) => {
                                                return (
                                                    <div key={i} className="p-3" style={{ fontSize: "17px", backgroundColor: i % 2 == 0 ? "#2e2e2e" : "#3b3b3b" }}>
                                                        <a className="text-white text-decoration-none" href={`/soal/${v.soal.id}/latihan`}>{v.soal.namasoal}</a>
                                                        <span className="float-end text-white-50">{SemenjakWaktu(new Date(v.kapan))}</span>
                                                    </div>
                                                )
                                            }).reverse()}
                                        </>
                                    } */}
                                </div>
                            }
                            {StatusTable === "solusi" &&
                                <div className="d-flex flex-column">
                                    {DataProfile.soalselesai.length <= 0 ?
                                        <div className="text-center fs-5">{DataProfile.username} tidak pernah menyelesaikan satu soal</div>
                                        :
                                        <>
                                            {DataProfile.soalselesai.map((v, i) => {
                                                return (
                                                    <div key={i} className="p-3" style={{ fontSize: "17px", backgroundColor: i % 2 == 0 ? "#2e2e2e" : "#3b3b3b" }}>
                                                        <a className="text-white text-decoration-none" href={`/soal/${v.soal._id}/solusi/${v._id}`}>{v.soal.namasoal} - {v.bahasa}</a>
                                                        <span className="float-end text-white-50">{v.createdAt}</span>
                                                    </div>
                                                )
                                            }).reverse()}
                                        </>
                                    }
                                </div>
                            }
                            {StatusTable === "favorit" &&
                                <div className="d-flex flex-column">
                                    {DataProfile.favorit.length <= 0 ?
                                        <div className="text-center fs-5">{DataProfile.username} tidak pernah favorit satu soal</div>
                                        :
                                        <>
                                            {DataProfile.favorit.map((v, i) => {
                                                return (
                                                    <div key={i} className="p-3" style={{ fontSize: "17px", backgroundColor: i % 2 == 0 ? "#2e2e2e" : "#3b3b3b" }}>
                                                        <a className="text-white text-decoration-none" href={`/soal/${v.soal._id}/latihan`}>{v.soal.namasoal}</a>
                                                    </div>
                                                )
                                            }).reverse()}
                                        </>
                                    }
                                </div>
                            }
                            {StatusTable === "soaldibuat" &&
                                <div className="d-flex flex-column">
                                    {DataProfile.soaldibuat.length <= 0 ?
                                        <div className="text-center fs-5">{DataProfile.username} tidak pernah membuat satu soal</div>
                                        :
                                        <>
                                            {DataProfile.soaldibuat.map((v, i) => {
                                                return (
                                                    <div key={i} className="p-3" style={{ fontSize: "17px", backgroundColor: i % 2 == 0 ? "#2e2e2e" : "#3b3b3b" }}>
                                                        <a className="text-white text-decoration-none" href={`/soal/${v._id}/solusi`}>{v.namasoal}</a>
                                                        <span className="float-end text-white-50">{v.createdAt}</span>
                                                    </div>
                                                )
                                            }).reverse()}
                                        </>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}