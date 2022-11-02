import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import dynamic from "next/dynamic";
import Router from "next/router";
import { BaseSyntheticEvent, useState } from "react";
import ReactAce from "react-ace/lib/ace";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Background from "../../../components/background";
import Navbar from "../../../components/navbar";
import styles from '../../../styles/latihan.module.css'
import { DataSoal, HasilJawaban, HasilKompiler } from "../../../types/tipe";
import { prisma } from "../../../database/prisma";
import { UpdateInfoAkun } from "../../../services/Servis";
import { Akun } from "@prisma/client";

const CodeEditor = dynamic(import('../../../components/codeEditor'), { ssr: false });

export async function getServerSideProps({ params, req, res }: { params: { soal: string }, req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { redirect: string };
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    const DataSoal = await prisma.soal.findUnique({
        where: {
            id: params.soal
        },
        select: {
            public: true
        }
    });

    if (DataSoal === null || !DataSoal.public) return { notFound: true }

    try {
        const data = await axios.post("http://localhost:3003/api/soal/dapatinSoal", {
            idsoal: params.soal
        }, {
            headers: { cookie: req.headers.cookie } as any
        }).then(d => d.data);

        return {
            props: {
                data,
                profile: DapatinUser.username
            }
        }
    } catch (e) {
        console.log(e);
        return {
            props: {
                suka_ngk: true
            }
        }
    }
}

export default function Soal({ data, profile }: { data: DataSoal & { suka_ngk: boolean }, profile: string }) {
    const [BahasaProgram, setBahasaProgram] = useState('python');
    const [Output, setOutput] = useState<HasilKompiler>({
        data: [{
            hasil: "",
            jawaban: "",
            koreksi: false,
            status: "Sukses"
        }],
        lulus: 0,
        gagal: 1,
        waktu: "",
        statuskompiler: ""
    });
    const [StatusTekananSoalOutput, setStatusTekananSoalOutput] = useState('soal');
    const [Kode, setKode] = useState(data.kumpulanjawaban[0].liatankode);
    const [KodeBenar, setKodeBenar] = useState<string>();
    const [Favorit, setFavorit] = useState<{ suka_ngk: boolean, berapa: number }>({
        suka_ngk: data.suka_ngk,
        berapa: JSON.parse(data.suka).length
    });

    let kodeEditor: ReactAce | undefined = undefined;

    const KlikOutput = () => {
        setStatusTekananSoalOutput('output');
        const pertanyaanElement = document.getElementById('tombolpertanyaan')!;
        const outputElement = document.getElementById('tomboloutput')!;

        if (outputElement.classList.contains("tombol_aktif")) {
            pertanyaanElement.classList.remove("tombolBerikutnya");
            pertanyaanElement.classList.add("tombol_aktif");
            pertanyaanElement.classList.add("bg-transparent");

            outputElement.classList.remove("tombol_aktif");
            outputElement.classList.remove("bg-transparent");
            outputElement.classList.add("tombolBerikutnya");
        }
    }

    const KlikPertanyaan = () => {
        setStatusTekananSoalOutput('soal');
        const pertanyaanElement = document.getElementById('tombolpertanyaan')!;
        const outputElement = document.getElementById('tomboloutput')!;

        if (pertanyaanElement.classList.contains("tombol_aktif")) {
            outputElement.classList.remove("tombolBerikutnya");
            outputElement.classList.add("tombol_aktif");
            outputElement.classList.add("bg-transparent");

            pertanyaanElement.classList.remove("tombol_aktif");
            pertanyaanElement.classList.remove("bg-transparent");
            pertanyaanElement.classList.add("tombolBerikutnya");
        }
    }

    const FavoritSoal = async () => {
        const _data = await axios.post("/api/soal/favorit", {
            idsoal: data.id
        }).then(d => d.data);

        setFavorit({
            suka_ngk: _data.suka_ngk,
            berapa: _data.berapa
        })
    }

    const KirimSolusi = async (e: BaseSyntheticEvent) => {
        const _data = await axios.post("/api/soal/kirimsolusi", {
            kode: KodeBenar,
            idsoal: data.id,
            bahasa: BahasaProgram
        });

        if (_data.status === 200) {
            Router.push(`/soal/${data.id}/solusi`);
        }
    }

    const GantiBahasaProgram = (e: BaseSyntheticEvent) => {
        setBahasaProgram(e.target.value)
        setKode(data.kumpulanjawaban.find((v) => v.bahasa === e.target.value)?.liatankode ?? "");
    }

    const StatusKirimOutput = () => {
        setStatusTekananSoalOutput('output');
        setOutput({ ...Output, statuskompiler: "Mengirim" });
    }

    const KirimJawaban = async (e: BaseSyntheticEvent, statusKlik: "test" | "jawaban") => {
        e.preventDefault();
        KlikOutput();
        StatusKirimOutput();
        const KodeSoal = kodeEditor!.editor.getValue();

        setOutput({ ...Output, statuskompiler: "Mengirim" });
        const hasil: HasilKompiler = await axios.post("/api/soal/konfirmasikode", {
            kode: KodeSoal,
            bahasa: BahasaProgram,
            idsoal: data.id,
            w: statusKlik
        }).then(v => v.data);

        if (statusKlik === "jawaban" && hasil.data.length <= hasil.lulus) {
            setKodeBenar(KodeSoal);
        }

        setOutput({ ...hasil, statuskompiler: "Sukses" });
    }

    if (Object.keys(data).length <= 0) {
        return (
            <div style={{ height: "100%" }}>
                <Navbar profile={profile} />
                <style>{`
                #__next {
                    height: 100%;
                }
                `}</style>
                <div className="d-flex align-items-center justify-content-center" style={{ height: "80%" }}>
                    <div className="text-white fs-1 text-center">
                        400 + 4 Tidak ketemu
                        <p className="fs-3 text-white-50">Halaman yang kamu kunjungi itu tidak ada</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Background>
            <Navbar profile={profile} />
            <style>{`
            .favorit:hover {
                color: rgb(180, 180, 180);
                cursor: pointer;
            }

            .tombol_aktif {
                color: white;
            }

            .tombol_aktif:hover {
                color: rgb(120, 120, 120);
            }

            .tombolBerikutnya {
                color: white;
                background: rgb(48, 48, 48);
                border: 1px solid rgb(48, 48, 48);
                border-radius: 3px;
                padding: 6px;
                text-transform: uppercase;
                font-size: 14px;
                letter-spacing: 1px;
            }

            .tombolBerikutnya:hover {
                background: rgb(40, 40, 40);
            }

            .scrollbar-primary::-webkit-scrollbar-thumb {
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
                background-color: #4285F4;
            }

            ::-webkit-scrollbar {
                background: rgb(50, 50, 50);
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
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <div className="d-flex flex-column h-100 ms-4">
                            <div className="row mb-3" style={{ background: "transparent" }}>
                                <div className="text-white">
                                    <div style={{ height: "55px" }}>
                                        <h5>{data.namasoal}</h5>
                                        <div>
                                            <span className={"me-4 " + (data.level <= 2 ? "" : data.level > 2 ? data.level > 4 ? "text-danger" : "text-warning" : "text-warning")}>Level {data.level}</span>
                                            <span className="me-4 favorit" onClick={FavoritSoal}>
                                                {Favorit.suka_ngk ?
                                                    <i className="bi bi-star-fill me-1"></i>
                                                    :
                                                    <i className="bi bi-star me-1"></i>
                                                }
                                                {Favorit.berapa}
                                            </span>
                                            <span>
                                                <i className="bi bi-person-fill me-2"></i>
                                                <a className="text-decoration-none text-white" href="#">{data.pembuat.username}</a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="text-white">
                                    <div style={{ height: "50px" }}>
                                        <button id="tombolpertanyaan" className='me-3 tombolBerikutnya border-0' onClick={KlikPertanyaan}>PERTANYAAN</button>
                                        <button id="tomboloutput" className="tombol_aktif bg-transparent border-0" onClick={KlikOutput}>OUTPUT</button>
                                    </div>
                                </div>
                            </div>
                            {StatusTekananSoalOutput === 'soal' ?
                                <div id="soal" className="mb-2 px-3 py-2 fs-5 text-white" style={{ height: "calc(100vh - 250px)", minHeight: "200px", background: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin" }}>
                                    <ReactMarkdown
                                        // eslint-disable-next-line react/no-children-prop
                                        children={data.soal}
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

                                    <hr />
                                    <div className="d-flex flex-row">
                                        <i className="bi bi-tags-fill me-3 fs-4"></i>
                                        {JSON.parse(data.tags).map((v: string, i: number) => {
                                            return (
                                                <div key={i} className="me-3 p-2 fs-6" style={{ background: "grey" }}>
                                                    {v}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                :
                                <div id="output" className="mb-2" style={{ height: "calc(100vh - 250px)", minHeight: "200px", background: "rgb(38, 38, 38)", border: "1px solid " + (Output.lulus >= Output.data.length ? "rgb(56, 138, 51)" : 'rgb(59, 59, 59)'), borderRadius: "5px", whiteSpace: "pre-wrap", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin" }}>
                                    {(Output.statuskompiler !== "Mengirim" && Output.statuskompiler !== "") && //Ini maksudnya apa yang masa lalu rafi, Semoga ya masa depan rafi bisa menjelaskan 20:41 29/10/2022
                                        <div>
                                            <div className="text-white px-3 mt-2">
                                                <span className="me-3">Waktu: {Output.waktu + ' ms'}</span>
                                                <span className="me-3 text-success">Lulus: {Output.lulus}</span>
                                                <span className="me-3 text-danger">Gagal: {Output.gagal}</span>
                                            </div>
                                            <hr className="text-white mb-2" style={{ marginBottom: "0px" }} />
                                        </div>
                                    }
                                    <div className="px-3">
                                        {Output.statuskompiler === "Sukses" &&
                                            <>
                                                {Output.error !== undefined ?
                                                    <div className="px-3 py-2 mt-3 rounded-2 text-white" style={{ background: "rgb(97, 57, 57)", border: "1px solid rgb(145, 78, 78)", letterSpacing: ".7px" }}>
                                                        <span style={{ whiteSpace: "pre-line" }}>
                                                            {Output.error}
                                                        </span>
                                                    </div>
                                                    :
                                                    <>
                                                        {Output?.data.map((v, i) => {
                                                            if (v.status === "Sukses") {
                                                                return (v.koreksi ?
                                                                    <details key={i} className="mb-2 panah text-success">
                                                                        <summary className="mb-2">Test {i + 1}: Success</summary>
                                                                        <div className="px-3 py-2 rounded-2 text-white" style={{ background: "rgb(35, 102, 53)", border: "1px solid rgb(51, 130, 72)", letterSpacing: ".7px" }}>
                                                                            Output: {v.hasil}, Jawaban: {v.jawaban}
                                                                        </div>
                                                                    </details>
                                                                    :
                                                                    <details key={i} className="mb-2 panah text-danger">
                                                                        <summary className="mb-2">Test {i + 1}: Gagal</summary>
                                                                        <div className="px-3 py-2 rounded-2 text-white" style={{ background: "rgb(97, 57, 57)", border: "1px solid rgb(145, 78, 78)", letterSpacing: ".7px" }}>
                                                                            Output: {v.hasil}, Jawaban: {v.jawaban}
                                                                        </div>
                                                                    </details>
                                                                );
                                                            }

                                                            return (
                                                                <details key={i} className="mb-2 panah text-danger" open>
                                                                    <summary className="mb-2">Test {i + 1}: Gagal</summary>
                                                                    <div className="px-3 py-2 rounded-2 text-white" style={{ background: "rgb(97, 57, 57)", border: "1px solid rgb(145, 78, 78)", letterSpacing: ".7px" }}>
                                                                        {v.hasil}
                                                                    </div>
                                                                </details>
                                                            )
                                                        })}
                                                    </>
                                                }
                                            </>
                                        }
                                        {(Output.lulus >= Output.data.length && Output.statuskompiler === "Sukses") &&
                                            <div style={{ color: "#30AD43" }}>
                                                Selamat, Kamu lulus semua test!
                                            </div>
                                        }
                                        {Output.statuskompiler === "Mengirim" &&
                                            <div className="text-white mt-2">Menigrim kode ke server...</div>
                                        }
                                    </div>
                                </div>
                            }
                            <div className="row">
                                <div className="text-white">
                                    <button className="tombolBerikutnya">
                                        <i className="bi bi-play-fill me-1"></i>
                                        Lewati
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-7">
                        <div className="d-flex flex-column h-100 ms-4">
                            <div className="row mb-3" style={{ background: "transparent" }}>
                                <div className="text-white">
                                    <div style={{ height: "55px" }}>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="text-white">
                                    <div style={{ height: "50px" }}>
                                        <select onChange={GantiBahasaProgram} className={styles.bahasaSelect}>
                                            {Object.values(data.kumpulanjawaban).map((v, i) => {
                                                return <option key={i} value={v.bahasa}>{v.bahasa.charAt(0).toUpperCase() + v.bahasa.slice(1)}</option>
                                            })}
                                        </select>
                                        <button className="tombolBerikutnya" style={{ float: "right" }}>Settings</button>
                                        <button className="tombolBerikutnya me-3" style={{ float: "right" }}>Reset</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2" style={{ height: "calc(100vh - 250px)", minHeight: "200px" }}>
                                <div>
                                    <CodeEditor
                                        mode={BahasaProgram}
                                        value={Kode}
                                        placeholder={"Tunjukkin kepintaran mu!"}
                                        onChange={() => setKode(kodeEditor!.editor.getValue())}
                                        refData={(ins: ReactAce) => { kodeEditor = ins }}
                                        autoComplete={true}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="">
                                    <div style={{ height: "50px" }}>
                                        {(Kode !== KodeBenar) ?
                                            <button className="text-white tombolBerikutnya" style={{ float: "right", width: "5%" }} onClick={(e) => KirimJawaban(e, "jawaban")}>
                                                Coba
                                            </button>
                                            :
                                            <button className="text-white tombolBerikutnya" style={{ float: "right", width: "5%", background: "#3c6e2a", borderColor: "#3c6e2a" }} onClick={(e) => KirimSolusi(e)}>
                                                Kirim
                                            </button>
                                        }
                                        <button className="text-white tombolBerikutnya me-4" style={{ float: "right", width: "5%" }} onClick={(e) => KirimJawaban(e, "test")}>
                                            Test
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}