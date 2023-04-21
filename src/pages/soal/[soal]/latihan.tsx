import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import dynamic from "next/dynamic";
import Router from "next/router";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import ReactAce from "react-ace/lib/ace";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Navbar from "../../../../components/navbar";
import styles from "../../../styles/IndexSolusi.module.css";
import { ISoal, HasilKompiler, IAkun } from "../../../../types/tipe";
import FavoritKomponen from "../../../../components/Favorit";
import Head from "next/head";
import { ApakahSudahMasuk } from "../../../../lib/Servis";
import { DataModel } from "../../../../lib/Model";

const CodeEditor = dynamic(import('../../../../components/codeEditor'), { ssr: false });

export async function getServerSideProps({ params, req, res }: { params: { soal: string }, req: NextApiRequest, res: NextApiResponse }) {
    const session = await ApakahSudahMasuk(req, res);
    if(!session.props) return session;

    const DataSoal = await DataModel.SoalModel.findById(params.soal).populate("pembuat").populate({ path: "favorit", populate: { path: "user", select: "_id" } }) as ISoal || null;

    if (DataSoal === null || !DataSoal.public) return { notFound: true }

    return {
        props: {
            DataSoal: { 
                ...JSON.parse(JSON.stringify(DataSoal)),
                suka_ngk: DataSoal.favorit.find((v) => v.user._id.toString() === session.props.Akun.id) !== undefined
            },
            Akun: session.props.Akun
        }
    }
}

export default function Soal({ DataSoal, Akun }: { DataSoal: ISoal & { suka_ngk: boolean }, Akun: IAkun }) {
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
    const [Kode, setKode] = useState(DataSoal.BahasaSoal[0].liatankode);
    const [KodeBenar, setKodeBenar] = useState<string>();
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

    const KirimSolusi = async (e: BaseSyntheticEvent) => {
        const _data = await axios.post("/api/soal/kirimsolusi", {
            kode: KodeBenar,
            idsoal: DataSoal._id,
            bahasa: BahasaProgram
        });

        if (_data.status === 200) {
            Router.push(`/soal/${DataSoal._id}/solusi`);
        }
    }

    const GantiBahasaProgram = (e: BaseSyntheticEvent) => {
        setBahasaProgram(e.target.value)
        setKode(DataSoal.BahasaSoal.find((v) => v.bahasa === e.target.value)?.liatankode ?? "");
    }

    const StatusKirimOutput = () => {
        setStatusTekananSoalOutput('output');
        setOutput({ ...Output, statuskompiler: "Mengirim" });
    }

    const Lewati = async () => {
        const RandomSoal = await axios.post("/api/soal/dapatinRandomSoal", {}).then(d => d.data.data) as ISoal;
        if(RandomSoal) {
            Router.push(`/soal/${RandomSoal._id}/latihan`);
        }
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
            idsoal: DataSoal._id,
            w: statusKlik
        }).then(v => v.data);

        if(hasil.error) {
            setOutput({...Output, ...hasil, statuskompiler: "Sukses"});
            return;
        }

        if (statusKlik === "jawaban" && hasil.data.length <= hasil.lulus) {
            setKodeBenar(KodeSoal);
        }

        setOutput({ ...hasil, statuskompiler: "Sukses" });
    }

    useEffect(() => {
        setBahasaProgram(DataSoal.BahasaSoal[0].bahasa);

        let KodingStorage = sessionStorage.getItem(`koding_${DataSoal._id}`) as any | null;
        if (KodingStorage !== null) {
            KodingStorage = JSON.parse(KodingStorage) as { [bahasa: string]: string };
            if (Object.keys(KodingStorage).includes(DataSoal.BahasaSoal[0].bahasa)) {
                setKode(KodingStorage[DataSoal.BahasaSoal[0].bahasa]);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Head>
                <title>{DataSoal.namasoal}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar profile={Akun} />
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
                                        <h5>{DataSoal.namasoal}</h5>
                                        <div>
                                            <span className={"me-4 " + (DataSoal.level <= 2 ? "" : DataSoal.level > 2 ? DataSoal.level > 4 ? "text-danger" : "text-warning" : "text-warning")}>Level {DataSoal.level}</span>
                                            <FavoritKomponen data={{ suka_ngk: DataSoal.suka_ngk, berapa: DataSoal.favorit.length, idsoal: DataSoal._id }} />
                                            <span>
                                                <i className="bi bi-person-fill me-2"></i>
                                                <a className={`me-3 text-decoration-none ${DataSoal.pembuat.admin ? styles['text-admin'] : DataSoal.pembuat.moderator ? styles['text-moderator'] : 'text-white'}`} href={`/profile/${DataSoal.pembuat.username}`}>{DataSoal.pembuat.username}</a>
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

                                    <hr />
                                    <div className="d-flex flex-row">
                                        <i className="bi bi-tags-fill me-3 fs-4"></i>
                                        {DataSoal.tags.map((v: string, i: number) => {
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
                                    {(Output.statuskompiler !== "Mengirim" && Output.statuskompiler !== "") && //Ini maksudnya apa yang masa lalu rafi, Semoga ya masa depan rafi bisa menjelaskan 20:41 29/10/2022 || Ini maksudnya menunjuin output rafi masa lalu, gini aja ndk tau bodo kali kau 17:30 17/04/2023
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
                                                                            <div className="mb-1 fs-6">
                                                                                Hasil: {v.hasil}, Jawaban: {v.jawaban}
                                                                            </div>
                                                                            {v.print !== undefined &&
                                                                                <div className="p-2" style={{ background: "rgb(50, 50, 50)", border: "1px solid rgb(150, 150, 150)", borderRadius: "5px" }}>
                                                                                    Output:
                                                                                    {v.print && v.print.map((d, id) => {
                                                                                        return (
                                                                                            <div key={id}>{d}</div>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </details>
                                                                    :
                                                                    <details key={i} className="mb-2 panah text-danger">
                                                                        <summary className="mb-2">Test {i + 1}: Gagal</summary>
                                                                        <div className="px-3 py-2 rounded-2 text-white" style={{ background: "rgb(97, 57, 57)", border: "1px solid rgb(145, 78, 78)", letterSpacing: ".7px" }}>
                                                                            Hasil: {v.hasil}, Jawaban: {v.jawaban}
                                                                        </div>
                                                                    </details>
                                                                );
                                                            }

                                                            return (
                                                                <details key={i} className="mb-2 panah text-danger">
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
                                    <button className="tombolBerikutnya" onClick={Lewati}>
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
                                            {Object.values(DataSoal.BahasaSoal).map((v, i) => {
                                                return <option key={i} value={v.bahasa}>{v.bahasa.charAt(0).toUpperCase() + v.bahasa.slice(1)}</option>
                                            })}
                                        </select>
                                        {/* <button className="tombolBerikutnya" style={{ float: "right" }}>Settings</button> */}
                                        <button className="tombolBerikutnya me-3" style={{ float: "right" }} onClick={() => setKode(DataSoal.BahasaSoal.find((v) => v.bahasa === BahasaProgram)!.liatankode)}>Reset</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2" style={{ height: "calc(100vh - 250px)", minHeight: "200px" }}>
                                <div>
                                    <CodeEditor
                                        mode={BahasaProgram}
                                        value={Kode}
                                        placeholder={"Tunjukkin kepintaran mu!"}
                                        onChange={() => { setKode(kodeEditor!.editor.getValue()); sessionStorage.setItem(`koding_${DataSoal._id}`, JSON.stringify({ [BahasaProgram]: Kode })) }}
                                        refData={(ins: ReactAce) => { kodeEditor = ins }}
                                        autoComplete={true}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div style={{ height: "25px" }}>
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
        </>
    )
}