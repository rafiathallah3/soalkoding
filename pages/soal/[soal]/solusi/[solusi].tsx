import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Navbar from "../../../../components/navbar";
import Image from "next/image";
import { DataSolusi, Komentar } from "../../../../types/tipe";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useState } from "react";
import { UpdateInfoAkun } from "../../../../services/Servis";
import { Akun } from "@prisma/client";
import FavoritKomponen from "../../../../components/Favorit";
import { useRouter } from "next/router";
import Modal from 'react-modal';
import { CSSProperties } from "react";

const StyleModalKonten: CSSProperties = {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "rgb(50, 50, 50)",
    border: "1px solid rgb(50, 50, 50)"
}

const StyleModalOverlay: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(40, 40, 40, 0.25)',
}

export async function getServerSideProps({ params, req, res }: { params: { soal: string, solusi: string }, req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { redirect: string };
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    const data = await axios.post(`${process.env.NAMAWEBSITE}/api/soal/solusi/dapatinSolusi`, {
        idsoal: params.soal,
        idsolusi: params.solusi
    }, {
        headers: { cookie: req.headers.cookie } as any
    }).then(d => d.data);
    data.idsolusi = params.solusi;

    return {
        props: {
            data,
            profile: {
                username: DapatinUser.username,
                gambar: DapatinUser.gambarurl
            }
        }
    }
}

Modal.setAppElement("#__next")
export default function SolusiId({ data, profile }: { data: DataSolusi, profile: { username: string, gambar: string } }) {
    const [ListKomentar, setListKomentar] = useState<Komentar[]>(data.solusi[0].komentar);
    const [TunjukkinModal, setTunjukkinModal] = useState(false);
    const [IdKomenHapus, setIdKomenHapus] = useState<number>();
    const router = useRouter();

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
        const _data: { suka: "biasa" | "up" | "down", berapa: number } = await axios.post('/api/soal/solusi/komentar', {
            idkomen,
            tipe: "hapus",
        }).then(d => d.data);
        router.reload();
    }

    return (
        <>
            <Navbar profile={profile} />
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
                        <span className={"p-2 fs-6 me-2 " + (data.soal.level <= 2 ? "text-white" : data.soal.level <= 4 ? "text-warning" : "text-danger")} style={{ background: "rgb(55, 55, 55)" }}>Level {data.soal.level}</span>
                        <a className="text-decoration-none text-white" style={{ float: "right" }} href={`/soal/${data.idsoal}/solusi`}>Kembali lagi ke soal sebelumnya</a>
                        {data.ApakahSudahSelesai &&
                            <i className="bi bi-check-lg"></i>
                        }
                    </div>
                    <div className="mb-4 text-white">
                        <span className="me-3">
                            <i className="bi bi-person-fill me-2"></i>
                            <a className="text-decoration-none text-white" href={`/profile/` + data.soal.pembuat.username}>{data.soal.pembuat.username}</a>
                        </span>
                        <FavoritKomponen data={{ suka_ngk: data.suka_ngk, berapa: data.soal.favorit.length, idsoal: data.idsoal }} />
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
                            <div className="me-2">
                                <Image src={profile.gambar} className="rounded text-white" height={60} width={60} alt="Potret seorang wanita cantik" />
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
                                        <div className="me-2">
                                            <Image src={v.user.gambarurl} className="rounded text-white" height={60} width={60} alt="Potret seorang wanita cantik" />
                                        </div>
                                        <div className="ms-2 w-100">
                                            <div className="mb-1">
                                                <a href={`/profile/${v.user.username}`} className="me-2 text-white text-decoration-none">{v.user.username}</a>
                                                <span className="text-white-50 me-2">{v.bikin as any}</span>
                                                <i className="bi bi-trash hapus-komen" onClick={() => { setIdKomenHapus(v.id); setTunjukkinModal(true) }} style={{ color: "red" }}></i>
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
            <Modal
                isOpen={TunjukkinModal}
                onRequestClose={() => setTunjukkinModal(false)}
                style={{ content: StyleModalKonten, overlay: StyleModalOverlay }}
            >
                <div className="fs-5 text-white mb-2">Hapus Komen</div>
                <p className="fs-6" style={{ color: "rgb(200, 200, 200)" }}>Kamu yakin ingin menghapus komen?</p>
                <div className="float-end">
                    <button className="me-4" onClick={() => setTunjukkinModal(false)} style={{ background: "transparent", border: "0px solid", color: "#1392bd" }}>Tidak</button>
                    <button className="me-3" onClick={() => { setTunjukkinModal(false); HapusKomen(IdKomenHapus!) }} style={{ background: "transparent", border: "0px solid", color: "#1392bd" }}>Iya</button>
                </div>
            </Modal>
        </>
    )
}