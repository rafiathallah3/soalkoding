import Link from 'next/link';
import Navbar from '../components/navbar';
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { NextApiRequest, NextApiResponse } from 'next';
import { UpdateInfoAkun } from '../services/Servis';
import { Akun } from '@prisma/client';
import axios from 'axios';
import { DataSoal } from '../types/tipe';
import Router from 'next/router';
import { useState } from 'react';

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { redirect: string };
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    const DapatinSoal = await axios.post(`${process.env.NAMAWEBSITE}/api/soal/dapatinRandomSoal`, {}, {
        headers: { cookie: req.headers.cookie } as any
    }).then(d => d.data);

    return {
        props: {
            data: DapatinSoal.data,
            profile: {
                username: DapatinUser.username,
                gambar: DapatinUser.gambarurl
            }
        }
    }
}

export default function Dashboard({ profile, data }: { profile: { username: string, gambar: string }, data: DataSoal }) {
    const [DataSoal, setDataSoal] = useState<DataSoal>(data);

    const DapatinRandomSoal = async () => {
        const Data = await axios.post("/api/soal/dapatinRandomSoal", {}).then(d => d.data);
        setDataSoal(Data.data);
    }

    return (
        <>
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
            <Navbar profile={profile} />

            <div className="container">
                <div className="row p-3 mb-4 rounded-3" style={{ background: "linear-gradient(rgb(39, 40, 41), rgb(41, 42, 43))", border: "1px solid rgb(61, 61, 61)" }}>
                    <div className='container-fluid mb-2'>
                        <button onClick={DapatinRandomSoal} className='btn btn-outline-danger' style={{ float: "right" }}>
                            {"Berikutnya "}
                            <i className='bi bi-arrow-right'></i>
                        </button>
                        <button onClick={() => Router.push(`/soal/${DataSoal.id}/latihan`)} className='me-4 btn btn-outline-success' style={{ float: "right" }}>Latihan</button>
                        <span className={"me-4 fs-6 " + (DataSoal.level <= 2 ? "text-white" : DataSoal.level > 2 ? DataSoal.level > 4 ? "text-danger" : "text-warning" : "text-warning")}>Level {DataSoal.level}</span>
                    </div>
                    <div className="mb-4 px-3 py-2 text-white fs-5" style={{ maxHeight: "180px", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin" }}>
                        <div className='mb-2'>
                            <a className='fs-4 text-white text-decoration-none' href={`soal/${DataSoal.id}/latihan`}>{DataSoal.namasoal}</a>
                        </div>
                        <ReactMarkdown
                            // eslint-disable-next-line react/no-children-prop
                            children={DataSoal.soal}
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

                <div className="row p-3 mb-4 rounded-3" style={{ background: "linear-gradient(rgb(39, 40, 41), rgb(41, 42, 43))", border: "1px solid rgb(61, 61, 61)" }}>
                    <div className='table-responsive'>
                        <table className="table text-white">
                            <thead>
                                <tr>
                                    <th scope="col" style={{ width: "4.6%" }}>Status</th>
                                    <th scope="col" style={{ width: "30.6%" }}>Judul</th>
                                    <th scope="col" style={{ width: "40.6%" }}>Deskripsi</th>
                                    <th scope="col" style={{ width: "15%" }}>Tingkat Kesulitan</th>
                                    <th scope="col">Pembuat</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row" className='text-center'><i className='bi bi-check-lg text-success'></i></th>
                                    <td>
                                        <a href="#!" className='text-decoration-none text-white'>Siapa Menang</a>
                                    </td>
                                    <td>Baris yang paling banyak dia pemenang!</td>
                                    <td className='text-success'>Mudah</td>
                                    <td>rapithon39125346</td>
                                </tr>
                                <tr>
                                    <th scope="row" className='text-center'><i className='bi bi-dash-lg'></i></th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td className='text-warning'>Lumayan</td>
                                    <td>rapithon39125346</td>
                                </tr>
                                <tr>
                                    <th scope="row" className='text-center'><i className='bi bi-dash-lg'></i></th>
                                    <td colSpan={2}>Larry the Bird</td>
                                    <td className='text-danger'>Susah</td>
                                    <td>rapithon39125346</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}