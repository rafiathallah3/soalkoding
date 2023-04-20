import Head from "next/head";
import { NextApiRequest, NextApiResponse } from "next";
import { ApakahSudahMasuk } from "../../lib/Servis";
import { IAkun, ISoal } from "../../types/tipe";
import Navbar from "../../components/navbar";
import axios from "axios";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useRouter } from 'next/router';
import styles from '../styles/IndexSolusi.module.css';

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const session = await ApakahSudahMasuk(req, res);
    if(!session.props) return session;

    const DapatinSoal = await axios.post(`${process.env.ROOT}/api/soal/dapatinRandomSoal`, {}, {
        headers: { cookie: req.headers.cookie } as any
    }).then(d => d.data) as { data: ISoal | undefined };

    return {
        props: {
            data: DapatinSoal.data ?? null,
            Akun: session.props.Akun
        }
    }
}

export default function Dashboard({ data, Akun }: { data: ISoal | null, Akun: IAkun | null }) {
    const [HasilDataSoal, setHasilDataSoal] = useState<ISoal | null>(data);
    const router = useRouter();

    const DapatinRandomSoal = async () => {
        const Data = await axios.post("/api/soal/dapatinRandomSoal", {}).then(d => d.data);
        setHasilDataSoal(Data.data);
    }

    return (
        <>
            <Head>
                <title>Dashboard</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <style jsx>{`
            .scrollbar-primary::-webkit-scrollbar-thumb {
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
                background-color: #4285F4;
            }
            .bi-discord:hover {
                color: rgb(114,137,218);
            }
            .bi-instagram:hover {
                color: #E1306C; 
            }
            .bi-youtube:hover {
                color: red;
            }
            
            ::-webkit-scrollbar {
                background: transparent;
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
            <Navbar profile={Akun} />

            <div className="container">
                <div className="row p-3 mb-4 rounded-3" style={{ background: "linear-gradient(rgb(39, 40, 41), rgb(41, 42, 43))", border: "1px solid rgb(61, 61, 61)" }}>
                    <div className='container-fluid mb-2'>
                        <button onClick={DapatinRandomSoal} className='btn btn-outline-danger' style={{ float: "right" }}>
                            {"Berikutnya "}
                            <i className='bi bi-arrow-right'></i>
                        </button>
                        {HasilDataSoal &&
                            <>
                                <button onClick={() => router.push(`/soal/${HasilDataSoal._id}/latihan`)} className='me-4 btn btn-outline-success' style={{ float: "right" }}>Kerjakan</button>
                                <span className={"me-4 fs-6 " + (HasilDataSoal.level <= 2 ? "text-white" : HasilDataSoal.level > 2 ? HasilDataSoal.level > 4 ? "text-danger" : "text-warning" : "text-warning")}>Level {HasilDataSoal.level}</span>
                                <span className='text-white'>
                                    <i className='bi bi-person-fill me-1'></i>
                                    <a className={`me-3 text-decoration-none ${data?.pembuat.admin ? styles['text-admin'] : data?.pembuat.moderator ? styles['text-moderator'] : 'text-white'}`} href={`/profile/` + data?.pembuat.username}>{data?.pembuat.username}</a>
                                </span>
                            </>
                        }
                    </div>
                    {HasilDataSoal &&
                        <div className="mb-4 px-3 py-2 text-white fs-5" style={{ maxHeight: "180px", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin" }}>
                            <div className='mb-2'>
                                <a className='fs-4 text-white text-decoration-none' href={`soal/${HasilDataSoal._id}/latihan`}>{HasilDataSoal.namasoal}</a>
                            </div>
                            <ReactMarkdown
                                // eslint-disable-next-line react/no-children-prop
                                children={HasilDataSoal.soal}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                // eslint-disable-next-line react/no-children-prop
                                                children={String(children).replace(/\n$/, '')}
                                                style={tomorrow as any}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            />
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        )
                                    }
                                }}
                            />
                        </div>
                        ||
                        <h3 className='text-white text-center'>Ada kesalahan saat mencari soal random mohon dicoba lagi</h3>
                    }
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="p-3 rounded-3 d-flex flex-row h-100" style={{ background: "linear-gradient(rgb(39, 40, 41), rgb(41, 42, 43))", border: "1px solid rgb(61, 61, 61)" }}>
                            <div className='text-white me-4' style={{ fontSize: "50px" }}>
                                <i className='bi bi-award-fill'></i>
                            </div>
                            <div className='text-white'>
                                <h4>Soal lainnya</h4>
                                <p>Cari soal yang keren dan mudah untuk dikerjakan berdasarkan kepintaranmu!</p>
                                <a className='btn btn-outline-success' href={'/soal/cari'}>Cari!</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="p-3 rounded-3 d-flex flex-row h-100" style={{ background: "linear-gradient(rgb(39, 40, 41), rgb(41, 42, 43))", border: "1px solid rgb(61, 61, 61)" }}>
                            <div className='text-white me-4' style={{ fontSize: "50px" }}>
                                <i className='bi bi-box-seam-fill'></i>
                            </div>
                            <div className='text-white'>
                                <h4>Mau Membuat soal?</h4>
                                <p>Kalian mempunyai ide soal yang kreatif bahkan tidak ada satupun orang yang bisa menjawab selain kamu? Buat sekarang dan kirim ke orang lain!</p>
                                <a className='btn btn-outline-info' href={'/soal/buat'}>Buat!</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}