import Navbar from "../../components/navbar";
import Image from "next/image"
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { DataProfile } from "../../types/tipe";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { UpdateInfoAkun } from "../../services/Servis";
import { Akun } from "@prisma/client";

export async function getServerSideProps({ params, req, res }: { params: { profile: string }, req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { redirect: string };
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    try {
        const data = await axios.post("http://localhost:3003/api/profile/dapatinProfile", {
            nama: params.profile
        }).then(d => d.data);

        return {
            props: {
                data,
                profile: DapatinUser === null ? "" : DapatinUser.username
            }
        }
    } catch (e) {
        return {
            notFound: true
        }
    }
}

export default function Profile({ data, profile }: { data: DataProfile, profile: string }) {
    const [StatusTable, setStatusTable] = useState<"soalselesai" | "solusi">('soalselesai');
    const InformasiDariUpdate = getCookie('infoedit');

    const namaBulan = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    //Sumber: https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
    function SemenjakWaktu(date: any) {
        var seconds = Math.floor((new Date() as any - date) / 1000);

        let interval = seconds / 31536000;

        if (interval >= 1) {
            return Math.floor(interval) + " tahun lalu";
        }
        interval = seconds / 2592000;
        if (interval >= 1) {
            return Math.floor(interval) + " bulan lalu";
        }
        interval = seconds / 86400;
        if (interval >= 1) {
            return Math.floor(interval) + " hari lalu";
        }
        interval = seconds / 3600;
        if (interval >= 1) {
            return Math.floor(interval) + " jam lalu";
        }
        interval = seconds / 60;
        if (interval >= 1) {
            return Math.floor(interval) + " menit lalu";
        }
        return Math.floor(seconds) + " detik lalu";
    }

    const KlikSoalSelesai = () => {
        setStatusTable("soalselesai");
        const SoalSelesaiElement = document.getElementById("tombolsoalselesai")!;
        const DiskusiElement = document.getElementById("tombolsolusi")!;

        if (SoalSelesaiElement.classList.contains("tombol-table")) {
            DiskusiElement.classList.remove("tombol-table-aktif");
            DiskusiElement.classList.add("tombol-table");

            SoalSelesaiElement.classList.remove("tombol-table");
            SoalSelesaiElement.classList.add("tombol-table-aktif");
        }
    }

    const KlikSolusi = () => {
        setStatusTable("solusi");
        const SoalSelesaiElement = document.getElementById("tombolsoalselesai")!;
        const DiskusiElement = document.getElementById("tombolsolusi")!;

        if (DiskusiElement.classList.contains("tombol-table")) {
            SoalSelesaiElement.classList.remove("tombol-table-aktif");
            SoalSelesaiElement.classList.add("tombol-table");

            DiskusiElement.classList.remove("tombol-table");
            DiskusiElement.classList.add("tombol-table-aktif");
        }
    }

    return (
        <>
            <Navbar profile={profile} />
            <div className="container">
                {typeof data === "string" ?
                    <div style={{ minHeight: "90%" }}>
                        <style>{`
                    #__next {
                        height: 100%;
                    }
                    `}</style>
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="text-white fs-1 text-center">
                                400 + 4 Tidak ketemu
                                <p className="fs-3 text-white-50">Halaman yang kamu kunjungi itu tidak ada</p>
                            </div>
                        </div>
                    </div>
                    :
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
                        {InformasiDariUpdate !== undefined &&
                            <div className="text-white mb-3 p-2" style={{ background: "#296331" }}>{InformasiDariUpdate}</div>
                        }
                        <div className="col-3 rounded-1 p-3" style={{ background: "rgb(45, 45, 45)", border: "1px solid rgb(61, 61, 61)" }}>
                            <div className="d-flex flex-column text-white mb-2 mt-2">
                                <div className="d-flex">
                                    <div className="d-flex flex-shrink-0 position-relative me-3" style={{ height: "5rem", width: "5rem" }}>
                                        <div className="w-100 h-100 position-relative">
                                            <Image src={data.gambarurl === null ? "/gambar/profile.png" : data.gambarurl} className="rounded-3 text-white" layout="fill" alt="Potret seorang wanita cantik" />
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <h5>{data.nama}</h5>
                                        <p className="text-white-50">{data.username}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <p className="text-white-50 mb-1">Member sejak</p>
                                <p className="text-white">{`${namaBulan[new Date(data.bikin).getMonth()]} ${new Date(data.bikin).getFullYear()}`}</p>
                            </div>
                            {data.tinggal &&
                                <div className="mb-3">
                                    <p className="text-white-50 mb-1">Saya tinggal di</p>
                                    <p className="text-white">{data.tinggal}</p>
                                </div>
                            }
                            {data.bio &&
                                <div className="mb-3">
                                    <p className="text-white-50 mb-1">Tentang Saya</p>
                                    <p className="text-white">{data.bio}</p>
                                </div>
                            }
                            <div className="mb-3">
                                {data.githuburl &&
                                    <a href={data.githuburl} target={"_blank"} rel="noopener noreferrer" title="Github Link" className="text-white fs-4 me-3">
                                        <i className="bi bi-github"></i>
                                    </a>
                                }
                                {data.website &&
                                    <a href={data.website} target={"_blank"} rel="noopener noreferrer" title="Website" className="text-white fs-4 me-3">
                                        <i className="bi bi-globe2"></i>
                                    </a>
                                }
                            </div>
                            <a href={"/profile/edit"} className="btn btn-dark form-control">
                                Edit Profile
                            </a>
                            <br />
                            <hr className="text-white" />
                            <div className="text-white fs-5">Soal sudah dikerjakan: {data.soalselesai.length}</div>
                            <div className='text-success me-5 fs-5'>Level 1 - 2: {data.soalselesai.filter(({ soal }) => soal.level <= 2).length}</div>
                            <div className='text-warning me-5 fs-5'>Level 3 - 4: {data.soalselesai.filter(({ soal }) => soal.level > 2 && soal.level <= 4).length}</div>
                            <div className='text-danger fs-5'>Level 5: {data.soalselesai.filter(({ soal }) => soal.level === 5).length}</div>
                        </div>
                        <div className="col-9">
                            {/* <div className="p-3 text-white rounded-3 mb-3" style={{ background: "rgb(45, 45, 45)", border: "1px solid rgb(61, 61, 61)" }}>
                                <div className="row">
                                    <div className="col text-center">
                                        <div className="fs-5">Total soal sudah dikerjakan</div>
                                        <div className="fs-2">0</div>
                                    </div>
                                    <div className="col">
                                        <div className='text-success me-5 fs-5'>Level 1 - 2: {data.soalselesai.filter(({ soal }) => soal.level <= 2).length}</div>
                                        <div className='text-warning me-5 fs-5'>Level 3 - 4: {data.soalselesai.filter(({ soal }) => soal.level > 2 && soal.level <= 4).length}</div>
                                        <div className='text-danger fs-5'>Level 5: {data.soalselesai.filter(({ soal }) => soal.level === 5).length}</div>
                                    </div>
                                </div>
                                <h5 className="text-center">Total soal yang sudah dikerjakan</h5>
                                <div className="text-center">
                                    <span className='text-success me-5 fs-4'>Level 1 - 2: {data.soalselesai.filter(({ soal }) => soal.level <= 2).length}</span>
                                    <span className='text-warning me-5 fs-4'>Level 3 - 4: {data.soalselesai.filter(({ soal }) => soal.level > 2 && soal.level <= 4).length}</span>
                                    <span className='text-danger fs-4'>Level 5: {data.soalselesai.filter(({ soal }) => soal.level === 5).length}</span>
                                </div>
                            </div> */}
                            <div className="p-3 text-white rounded-3" style={{ background: "rgb(45, 45, 45)", border: "1px solid rgb(61, 61, 61)" }}>
                                <div className="mb-3">
                                    <button id="tombolsoalselesai" className="tombol-table-aktif" onClick={KlikSoalSelesai}>Soal selesai</button>
                                    <button id="tombolsolusi" className='tombol-table' onClick={KlikSolusi}>Solusi</button>
                                </div>
                                {StatusTable === "soalselesai" &&
                                    <div className="d-flex flex-column">
                                        {data.soalselesai.length <= 0 ?
                                            <div className="text-center fs-5">{data.username} tidak pernah menyelesaikan satu soal</div>
                                            :
                                            <>
                                                {data.soalselesai.map((v, i) => {
                                                    return (
                                                        <div key={i} className="p-3" style={{ fontSize: "17px", backgroundColor: i % 2 == 0 ? "#2e2e2e" : "#3b3b3b" }}>
                                                            <a className="text-white text-decoration-none" href={`/soal/${v.soal.id}/latihan`}>{v.soal.namasoal}</a>
                                                            <span className="float-end text-white-50">{SemenjakWaktu(new Date(v.kapan))}</span>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }
                                    </div>
                                }
                                {StatusTable === "solusi" &&
                                    <div className="d-flex flex-column">
                                        {data.soalselesai.length <= 0 ?
                                            <div className="text-center fs-5">{data.username} tidak pernah menyelesaikan satu soal</div>
                                            :
                                            <>
                                                {data.soalselesai.map((v, i) => {
                                                    return (
                                                        <div key={i} className="p-3" style={{ fontSize: "17px", backgroundColor: i % 2 == 0 ? "#2e2e2e" : "#3b3b3b" }}>
                                                            <a className="text-white text-decoration-none" href={`/soal/${v.soal.id}/solusi/${v.id}`}>{v.soal.namasoal} - {v.bahasa}</a>
                                                            <span className="float-end text-white-50">{SemenjakWaktu(new Date(v.kapan))}</span>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}