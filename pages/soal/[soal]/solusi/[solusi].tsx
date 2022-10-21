import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Navbar from "../../../../components/navbar";
import Image from "next/image";
import Link from "next/link";
import { DataSolusi, Komentar } from "../../../../types/tipe";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";

export async function getServerSideProps({ params, req, res }: { params: { soal: string, solusi: string }, req: NextApiRequest, res: NextApiResponse }) {
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

    const data = await axios.post(`http://${req.headers.host}/api/soal/solusi/dapatinSolusi`, {
        idsoal: params.soal,
        idsolusi: params.solusi
    }, {
        headers: { cookie: req.headers.cookie } as any
    }).then(d => d.data);
    data.idsolusi = params.solusi;

    return {
        props: {
            data
        }
    }
}

export default function SolusiId({ data }: { data: DataSolusi }) {
    const [Favorit, setFavorit] = useState<{ suka_ngk: boolean, berapa: number }>({
        suka_ngk: data.suka_ngk,
        berapa: JSON.parse(data.soal.suka).length
    });
    const [ListKomentar, setListKomentar] = useState<Komentar[]>(data.solusi[0].komentar);

    const KlikKepintaran = async (elementTombol: MouseEvent, idsolusi: string) => {
        const _data = await axios.post("/api/soal/solusi/pintar", {
            idsoal: data.idsoal,
            idsolusi,
        }).then(d => d.data);

        if (_data.suka_ngk) {
            (elementTombol.target as any).style.borderColor = 'white';
            (elementTombol.target as any).style.color = 'white';
        } else {
            (elementTombol.target as any).style.borderColor = 'rgb(150, 150, 150)';
            (elementTombol.target as any).style.color = 'rgb(170, 170, 170)';
        }
        document.getElementById(_data.idsolusi)!.innerText = _data.berapa;
    }

    const FavoritSoal = async () => {
        const _data = await axios.post("/api/soal/favorit", {
            idsoal: data.idsoal
        }).then(d => d.data);

        setFavorit({
            suka_ngk: _data.suka_ngk,
            berapa: _data.berapa
        })
    }

    const KirimKomentar = async () => {
        const _data = await axios.post('/api/soal/solusi/komentar', {
            idsolusi: data.idsolusi,
            komentar: (document.getElementById('textkomen')! as any).value,
            tipe: "komen",
        }).then(d => d.data);

        (document.getElementById('textkomen')! as any).value = '';
        setListKomentar(_data.komentar);
    }

    const VoteKomen = async (element: React.MouseEvent<HTMLElement>, kondisi: "up" | "down", idkomen: number) => {
        const _data: { suka: "biasa" | "up" | "down", berapa: number } = await axios.post('/api/soal/solusi/komentar', {
            kondisi,
            idkomen,
            tipe: "vote",
        }).then(d => d.data);

        switch (_data.suka) {
            case "up":
                (element.target as HTMLSpanElement).style.color = 'green';
                document.getElementById('down-' + idkomen.toString())!.style.color = 'rgb(150, 150, 150)';
                break;
            case "down":
                (element.target as HTMLSpanElement).style.color = 'red';
                document.getElementById('up-' + idkomen.toString())!.style.color = 'rgb(150, 150, 150)';
                break;
            case "biasa":
                (element.target as HTMLSpanElement).style.color = 'rgb(150, 150, 150)';
                break;
        }

        document.getElementById('komen-' + idkomen.toString())!.innerText = _data.berapa.toString();
    }

    const HapusKomen = async (idkomen: number) => {
        const maukah = confirm('Apa kamu yakin ingin menghapus komen ini?')

        if (maukah) {
            const _data: { suka: "biasa" | "up" | "down", berapa: number } = await axios.post('/api/soal/solusi/komentar', {
                idkomen,
                tipe: "hapus",
            }).then(d => d.data);
        }
    }

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
            <style jsx>{`
            .tombol-keren {
                background: rgb(50, 50, 50);
                color: rgb(170, 170, 170);
                border: 1px solid rgb(150, 150, 150);
                transition: 0.2s;
            }

            .tombol-keren:hover { 
                color: white !important;
            }

            .favorit:hover {
                color: rgb(180, 180, 180);
                cursor: pointer;
            }

            .voting {
                color: rgb(150, 150, 150);
                transition: .2s;
            }

            .voting:hover {
                color: white;
                cursor: pointer;
            }

            .hapus-komen:hover {
                cursor: pointer;
            }

            ::-webkit-scrollbar {
                background: rgb(36, 36, 36);
                opacity: 1;
                width: 10px;
            }

            ::-webkit-scrollbar-thumb {
                background: rgb(74, 74, 74);
                border-radius: 10px;
            }

            ::-webkit-scrollbar-corner {
                border-radius: 2xpx;
                background: rgb(74, 74, 74);
            }
            `}</style>
            <div className="container">
                <div className="p-3 mb-3 rounded-2" style={{ background: "rgb(48, 48, 48)" }}>
                    <div className="mb-3 text-white">
                        <span className="me-3">{data.soal.namasoal}</span>
                        <span className="p-2 fs-6 me-2" style={{ background: "rgb(55, 55, 55)" }}>Level {data.soal.level}</span>
                        <a className="text-decoration-none text-white" style={{ float: "right" }} href={`/soal/${data.idsoal}/solusi`}>Kembali lagi ke soal sebelumnya</a>
                    </div>
                    <div className="mb-4 text-white">
                        <span className="me-3">
                            <i className="bi bi-person-fill me-2"></i>
                            <a className="text-decoration-none text-white" href={`/profile/` + data.soal.pembuat.username}>{data.soal.pembuat.username}</a>
                        </span>
                        <span className="me-3 favorit" onClick={FavoritSoal}>
                            {Favorit.suka_ngk ?
                                <i className="bi bi-star-fill me-1"></i>
                                :
                                <i className="bi bi-star me-1"></i>
                            }
                            {Favorit.berapa}
                        </span>
                        <span title="Jumlah solusi">
                            <i className="bi bi-calendar-check me-1"></i>
                            {data.JumlahSolusi}
                        </span>
                        <div className="text-white-50 float-end">
                            {new Date(data.solusi[0].kapan).getDate() + '/' + (new Date(data.solusi[0].kapan).getMonth() + 1) + '/' + new Date(data.solusi[0].kapan).getFullYear()}
                        </div>
                    </div>
                    {data.ApakahSudahSelesai ?
                        <>
                            <div className="px-2 mb-3">
                                <SyntaxHighlighter customStyle={{ maxHeight: "200px" }} language={data.solusi[0].bahasa} style={tomorrow as any}>{data.solusi[0].kode}</SyntaxHighlighter>
                            </div>
                            <button className="tombol-keren me-3" style={{ "borderColor": (data.solusi[0].apakahSudahPintar ? 'white' : 'rgb(150, 150, 150)'), "color": (data.solusi[0].apakahSudahPintar ? 'white' : 'rgb(170, 170, 170)') }} onClick={(e) => KlikKepintaran(e as any, data.solusi[0].id)}>
                                <i className="bi bi-arrow-up-short"></i>
                                Pintar
                                <span className={"ms-2"} id={data.solusi[0].id}>{JSON.parse(data.solusi[0].pintar).length}</span>
                            </button>
                        </>
                        :
                        <div className="text-white text-center fs-5">
                            Kamu belum menyelesaikan soal
                        </div>
                    }
                </div>
                {data.ApakahSudahSelesai &&
                    <div className="p-3 rounded-2" style={{ background: "rgb(48, 48, 48)" }}>
                        <div className="d-flex flex-row">
                            <div>
                                <Image src="/profile.jpeg" className="rounded me-2 text-white" height={60} width={68} alt="Potret seorang wanita cantik" />
                            </div>
                            <div className="w-100">
                                <textarea className="w-100" id="textkomen" style={{ resize: "none", backgroundColor: "rgb(40, 40, 40)", outline: "none", color: "rgb(200, 200, 200)" }}></textarea>
                                <button className="float-end text-white btn" style={{ background: "#337d32", borderColor: "rgb(40, 40, 40)" }} onClick={KirimKomentar}>Kirim</button>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            {ListKomentar.map((v, i) => {
                                return (
                                    <div key={i} className="d-flex flex-row mb-3">
                                        <div>
                                            <Image src="/profile.jpeg" className="rounded me-2 text-white" height={60} width={68} alt="Potret seorang wanita cantik" />
                                        </div>
                                        <div className="w-100">
                                            <div className="mb-1">
                                                <Link href={`/profile/${v.user.username}`}>
                                                    <a className="me-3 text-white text-decoration-none">{v.user.username}</a>
                                                </Link>
                                                <span className="text-white-50 me-3">{SemenjakWaktu(new Date(v.bikin))}</span>
                                                <i className="bi bi-trash hapus-komen" onClick={() => HapusKomen(v.id)} style={{ color: "red" }}></i>
                                            </div>
                                            <div className="text-white mb-2">{v.komen}</div>
                                            <div>
                                                <span className="text-white me-2" id={'komen-' + v.id}>{JSON.parse(v.upvote).length - JSON.parse(v.downvote).length}</span>
                                                <i className="bi bi-caret-up-fill me-2 voting" id={'up-' + v.id} style={{ color: (v.apakahSudahVote === "up" ? 'green' : 'rgb(150, 150, 150)') }} onClick={(e) => VoteKomen(e, "up", v.id)}></i>
                                                <i className="bi bi-caret-down-fill voting" id={'down-' + v.id} style={{ color: (v.apakahSudahVote === "down" ? 'red' : 'rgb(150, 150, 150)') }} onClick={(e) => VoteKomen(e, "down", v.id)}></i>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
            </div>
        </>
    )
}