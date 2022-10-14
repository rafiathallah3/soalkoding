import Navbar from "../../components/navbar";
import Image from "next/image"
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { DataProfile } from "../../types/tipe";
import { getCookie, setCookie } from "cookies-next";

export async function getServerSideProps({ params, req, res }: { params: { profile: string }, req: NextApiRequest, res: NextApiResponse }) {
    const infoakun = getCookie('infoakun', { req, res }) as string;
    if (infoakun === undefined) return { redirect: { destination: '/login', permanent: false } };

    const DapatinToken = await axios.post("http://localhost:3003/api/dapatintokenbaru", {}, {
        headers: { cookie: req.headers.cookie } as any
    }).then(d => d.data);

    setCookie('infoakun', DapatinToken, {
        req, res,
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
    });

    try {
        const data = await axios.post("http://localhost:3003/api/profile/dapatinProfile", {
            nama: params.profile
        }).then(d => d.data);

        return {
            props: {
                data
            }
        }
    } catch (e) {
        return {
            notFound: true
        }
    }
}

export default function Profile({ data }: { data: DataProfile }) {
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

    return (
        <>
            <Navbar />
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
                    <div className="row min-vh-100">
                        <div className="col-3 rounded-1" style={{ background: "rgb(48, 48, 48)", height: "28rem" }}>
                            <div className="d-flex flex-row text-white mb-2 mt-2">
                                <Image src="/profile.jpeg" className="rounded-3 text-white" height={80} width={80} alt="Potret seorang wanita cantik" />
                                <div className="ms-2">
                                    <h3>{data.nama}</h3>
                                    <p className="text-white-50">@{data.username}</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <p className="text-white-50 mb-1">Saya tinggal di</p>
                                <p className="text-white">{data.tinggal}</p>
                            </div>
                            <div className="mb-3">
                                <p className="text-white-50 mb-1">Member sejak</p>
                                <p className="text-white">{`${namaBulan[new Date(parseInt(data.bikin)).getMonth()]} ${new Date(parseInt(data.bikin)).getFullYear()}`}</p>
                            </div>
                            <div className="mb-3">
                                <p className="text-white-50 mb-1">Tentang Saya</p>
                                <p className="text-white">{data.bio}</p>
                            </div>
                            <div className="mb-3">
                                <a className="text-white fs-4 me-3" href={data.githuburl} target={"_blank"} rel="noopener noreferrer">
                                    <i className="bi bi-github"></i>
                                </a>
                            </div>
                            <button className="btn btn-dark form-control">
                                Edit PRofile
                            </button>
                        </div>
                        <div className="col-9">
                            <div className="p-1 text-white rounded-3 mb-3" style={{ background: "rgb(45, 45, 45)", border: "1px solid rgb(61, 61, 61)" }}>
                                <h5 className="text-center">Total soal yang sudah dikerjakan</h5>
                                <div className="text-center">
                                    <span className='text-success me-5 fs-4'>Level 1 - 2: {data.soalselesai.filter(({ soal }) => soal.level <= 2).length}</span>
                                    <span className='text-warning me-5 fs-4'>Level 3 - 4: {data.soalselesai.filter(({ soal }) => soal.level > 2 && soal.level <= 4).length}</span>
                                    <span className='text-danger fs-4'>Level 5: {data.soalselesai.filter(({ soal }) => soal.level === 5).length}</span>
                                </div>
                            </div>
                            <div className="p-3 text-white rounded-3" style={{ background: "rgb(45, 45, 45)", border: "1px solid rgb(61, 61, 61)" }}>
                                <div className="mb-3">
                                    <button className='me-4 btn btn-outline-success'>Soal</button>
                                    <button className='me-4 btn btn-outline-success'>Diskusi</button>
                                </div>
                                <div className="d-flex flex-column">
                                    {data.soalselesai.map((v, i) => {
                                        return (
                                            <div key={i} className="p-3" style={{ fontSize: "17px", backgroundColor: i % 2 == 0 ? "#2e2e2e" : "#3b3b3b" }}>
                                                <a className="text-white text-decoration-none" href={`/soal/${v.id}/solusi/${v.soal.id}`}>{v.soal.namasoal}</a>
                                                <span className="float-end text-white-50">{SemenjakWaktu(new Date(v.kapan))}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}