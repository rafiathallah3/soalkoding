import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Navbar from "../../../../../components/navbar";
import Image from "next/image";
import { DataSoal, IAkun, IDiskusi, ISoal } from "../../../../../types/tipe";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useState } from "react";
import FavoritKomponen from "../../../../../components/Favorit";
import { useRouter } from "next/router";
import Modal from 'react-modal';
import { CSSProperties } from "react";
import styles from '../../../../styles/IndexSolusi.module.css'
import Head from "next/head";
import { ApakahSudahMasuk, SemenjakWaktu } from "../../../../../lib/Servis";
import { DataModel } from "../../../../../lib/Model";

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
    const session = await ApakahSudahMasuk(req, res);
    if(!session.props) return session;

    // const DataSolusi = await DataModel.SolusiModel.findById(params.solusi)
    //     .populate("soal")
    //     .populate("komentar") as ISolusi || null;
    // if(DataSolusi === null) return { notFound: true }
    const DataSoal = await DataModel.SoalModel.findById(params.soal)
        .populate("pembuat")
        .populate({ path: "solusi", populate: { path: "diskusi", populate: { path: "user" } } })
        .populate({ path: "solusi", populate: { path: "user" } })
        .populate({ path: "favorit", populate: { path: "user", select: "_id" } }) as ISoal || null;
    if(DataSoal === null) return { notFound: true };

    const ParseSoal = JSON.parse(JSON.stringify(DataSoal)) as ISoal;
    ParseSoal.solusi = ParseSoal.solusi.filter((v) => v._id === params.solusi);

    return {
        props: {
            data: {
                soal: { ...ParseSoal, solusi: ParseSoal.solusi.map((v) => ({ ...v, diskusi: v.diskusi.map((d) => ({ ...d, createdAt: SemenjakWaktu(new Date(d.createdAt)) })) })) } as ISoal,
                ApakahSudahSelesai: DataSoal.solusi.find((v) => v.user._id.toString() === session.props.Akun.id) !== undefined,
                suka_ngk: DataSoal.favorit.find((v) => v.user._id.toString() === session.props.Akun.id) !== undefined,
            },
            Akun: session.props.Akun
        }
    }
}

Modal.setAppElement("#__next")
export default function SolusiId({ data, Akun }: { data: DataSoal, Akun: IAkun & { id: string } }) {
    const [TunjukkinModal, setTunjukkinModal] = useState(false);
    const [IdKomenHapus, setIdKomenHapus] = useState<string>();
    const [Komen, setKomen] = useState("");
    const router = useRouter();

    const KlikKepintaran = async (elementTombol: MouseEvent, idsolusi: string) => {
        const _data = await axios.post("/api/soal/solusi/pintar", {
            idsoal: data.soal._id,
            idsolusi,
        }).then(d => d.data);

        if (_data.suka_ngk) {
            (elementTombol.target as any).style.borderColor = 'white';
            (elementTombol.target as any).style.color = 'white';
        } else {
            (elementTombol.target as any).style.borderColor = 'rgb(150, 150, 150)';
            (elementTombol.target as any).style.color = 'rgb(170, 170, 170)';
        }

        document.getElementById(idsolusi)!.innerText = _data.berapa;
    }

    const BuatDiskusi = async () => {
        await axios.post('/api/soal/diskusi', {
            idsolusi: data.soal.solusi[0]._id,
            idsoal: data.soal._id,
            text: Komen,
            tipe: "buat",
            jenis: "solusi"
        }).then(d => d.data);

        router.reload();
    }

    const VoteDiskusi = async (element: React.MouseEvent<HTMLElement>, status: "up" | "down", iddiskusi: string) => {
        const _data: { suka: "biasa" | "up" | "down", berapa: number } = await axios.post('/api/soal/diskusi', {
            status,
            iddiskusi,
            idsoal: data.soal._id,
            tipe: "vote",
            jenis: "solusi"
        }).then(d => d.data);

        switch (_data.suka) {
            case "up":
                (element.target as HTMLSpanElement).style.color = 'green';
                document.getElementById('down-' + iddiskusi.toString())!.style.color = 'rgb(150, 150, 150)';
                break;
            case "down":
                (element.target as HTMLSpanElement).style.color = 'red';
                document.getElementById('up-' + iddiskusi.toString())!.style.color = 'rgb(150, 150, 150)';
                break;
            case "biasa":
                (element.target as HTMLSpanElement).style.color = 'rgb(150, 150, 150)';
                break;
        }

        document.getElementById('komen-' + iddiskusi.toString())!.innerText = _data.berapa.toString();
    }

    const HapusDiskusi = async (iddiskusi: string) => {
        await axios.post('/api/soal/diskusi', {
            iddiskusi,
            tipe: "hapus",
            idsoal: data.soal._id,
            idsolusi: data.soal.solusi[0]._id,
            jenis: "solusi"
        }).then(d => d.data);

        router.reload();
    }

    const title = `Solusi untuk ${data.soal.namasoal} buatan ${data.soal.solusi[0].user.username}`;
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar profile={Akun} />
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
                        <a className="text-decoration-none text-white" style={{ float: "right" }} href={`/soal/${data.soal._id}/solusi`}>Kembali ke soal sebelumnya</a>
                        {data.ApakahSudahSelesai &&
                            <i className="bi bi-check-lg"></i>
                        }
                    </div>
                    <div className="mb-4 text-white">
                        <span className="me-3">
                            <i className="bi bi-person-fill me-2"></i>
                            <a href={`/profile/${data.soal.solusi[0].user.username}`} className={`me-2 text-decoration-none ${data.soal.solusi[0].user.admin ? styles['text-admin'] : data.soal.solusi[0].user.moderator ? styles['text-moderator'] : 'text-white'}`}>{data.soal.solusi[0].user.username}</a>
                        </span>
                        <FavoritKomponen data={{ suka_ngk: data.suka_ngk, berapa: data.soal.favorit.length, idsoal: data.soal._id }} />
                        <span title="Jumlah solusi">
                            <i className="bi bi-calendar-check me-1"></i>
                            {data.soal.solusi.length}
                        </span>
                        <div className="text-white-50 float-end">
                            {new Date(data.soal.solusi[0].createdAt).getDate() + '/' + (new Date(data.soal.solusi[0].createdAt).getMonth() + 1) + '/' + new Date(data.soal.solusi[0].createdAt).getFullYear()}
                        </div>
                    </div>
                    {data.ApakahSudahSelesai ?
                        <>
                            <div className="px-2 mb-3">
                                <SyntaxHighlighter customStyle={{ maxHeight: "200px" }} language={data.soal.solusi[0].bahasa} style={tomorrow as any}>{data.soal.solusi[0].kode}</SyntaxHighlighter>
                            </div>
                            <button className="tombol-keren me-3" style={{ "borderColor": (data.soal.solusi[0].pintar.includes(Akun.id) ? 'white' : 'rgb(150, 150, 150)'), "color": (data.soal.solusi[0].pintar.includes(Akun.id) ? 'white' : 'rgb(170, 170, 170)') }} onClick={(e) => KlikKepintaran(e as any, data.soal.solusi[0]._id)}>
                                <i className="bi bi-arrow-up-short"></i>
                                Pintar
                                <span className={"ms-2"} id={data.soal.solusi[0]._id}>{data.soal.solusi[0].pintar.length}</span>
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
                                <Image src={Akun.gambar} className="rounded text-white" height={60} width={60} alt="Potret seorang wanita cantik" />
                            </div>
                            <div className="w-100">
                                <textarea className="w-100" value={Komen} onChange={(e) => setKomen(e.target.value)} style={{ resize: "none", backgroundColor: "rgb(40, 40, 40)", outline: "none", color: "rgb(200, 200, 200)" }}></textarea>
                                <button className="float-end text-white btn" style={{ background: "#337d32", borderColor: "rgb(40, 40, 40)" }} onClick={BuatDiskusi}>Kirim</button>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            {data.soal.solusi[0].diskusi.map((v, i) => {
                                return (
                                    <div key={i} className="d-flex flex-row mb-3">
                                        <div className="me-2">
                                            <Image src={v.user.gambar} className="rounded text-white" height={60} width={60} alt="Potret seorang wanita cantik" />
                                        </div>
                                        <div className="ms-2 w-100">
                                            <div className="mb-1">
                                                <a href={`/profile/${v.user.username}`} className={`me-2 text-decoration-none ${v.user.admin ? styles['text-admin'] : v.user.moderator ? styles['text-moderator'] : 'text-white'}`}>{v.user.username}</a>
                                                <span className="text-white-50 me-2">{v.createdAt}</span>
                                                {(Akun.username === v.user.username || Akun.admin || Akun.moderator) &&
                                                    <i className="bi bi-trash hapus-komen" onClick={() => { setIdKomenHapus(v._id); setTunjukkinModal(true) }} style={{ color: "red" }}></i>
                                                }
                                            </div>
                                            <div className="text-white mb-2">{v.text}</div>
                                            <span className="text-white me-2" id={'komen-' + v._id}>{v.upvote.length - v.downvote.length}</span>
                                            <i className="bi bi-caret-up-fill me-2" id={'up-' + v._id} role={"button"} style={{ color: (v.upvote.includes(Akun.id) ? 'green' : 'rgb(150, 150, 150)') }} onClick={(e) => VoteDiskusi(e, "up", v._id)}></i>
                                            <i className="bi bi-caret-down-fill" id={'down-' + v._id} role={"button"} style={{ color: (v.downvote.includes(Akun.id) ? 'red' : 'rgb(150, 150, 150)') }} onClick={(e) => VoteDiskusi(e, "down", v._id)}></i>
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
                    <button className="me-3" onClick={() => { setTunjukkinModal(false); HapusDiskusi(IdKomenHapus!) }} style={{ background: "transparent", border: "0px solid", color: "#1392bd" }}>Iya</button>
                </div>
            </Modal>
        </>
    )
}