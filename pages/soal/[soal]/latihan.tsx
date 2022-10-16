import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
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
import jwt from 'jsonwebtoken';
import { DataSoal, HasilJawaban } from "../../../types/tipe";
import { prisma } from "../../../database/prisma";
import { decrypt } from "../../../database/UbahKeHash";

const CodeEditor = dynamic(import('../../../components/codeEditor'), { ssr: false });

export async function getServerSideProps({ params, req, res }: { params: { soal: string }, req: NextApiRequest, res: NextApiResponse }) {
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

    const DapatinUser = await prisma.akun.findUnique({
        where: {
            id: JSON.parse(decrypt((jwt.verify(DapatinToken, process.env.TOKENRAHASIA!) as any).datanya)).id
        }
    })

    if (DapatinUser === null) return { redirect: { destination: '/login', permanent: false } };

    try {
        const data = await axios.post("http://localhost:3003/api/soal/dapatinSoal", {
            idsoal: params.soal
        }, {
            headers: { cookie: req.headers.cookie } as any
        });

        return {
            props: {
                data: data.data
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

const ListBahasaProgram = {
    "71": "python",
    "63": "javascript",
    "74": "typescript",
    "54": "c_cpp",
    "64": "lua",
    "73": "rust",
    "72": "ruby"
}

const ListKode = {
    "71": `def Solusi(angka, list_bulatan):
    hasil = [0]*len(list_bulatan)
    for i,v in enumerate(list_bulatan): 
        total = 0
        t = False
        listc = [] 
        for j in angka:
            if((v / j).is_integer()):
                total = v//j
                t = True
                listc.append(total)

        if t: 
            hasil[i] = min(listc)
            continue

        d = False
        while v >= hasil[i]:
            if(hasil[i] + max(angka) > v):
                c = (hasil[i]+max(angka)) - v
                if c in angka:
                    total += 1
                    hasil[i] = total
                else: 
                    hasil[i] = 0
                    d = True

                break
            
            hasil[i] += max(angka)
            total += 1
        
        if not d:
            hasil[i] = total

    return hasil

    # if __name__ == "__main__":
    # def ApakahSama(fungsi, parameter, jawaban):
    #     try:
    #         hasil = fungsi(*parameter)
    #         return {"hasil": str(hasil) if hasil == None else hasil, "jawaban": jawaban, "status": "Sukses"}
    #     except Exception as e:
    #         import base64
    #         return {"hasil": base64.b64encode(str(e).encode('utf-8')).decode('utf-8'), "jawaban": jawaban, "status": "Error"}
    
    # print(ApakahSama(Solusi, (5, 6), 30))
    # print(ApakahSama(Solusi, (3, 10), 30))
    # print(ApakahSama(Solusi, (5, 2), 30))`,
    "63": `function Solusi() {
    console.log("Solusi");
}`,
    "74": `function Solusi() {
    console.log("Solusi");
}`,
    "54": `#include <string>
    void Solusi() {
    std::cout << "Solusi";
}`,
    "64": `function Solusi()
    print("Solusi");
end`,
    "73": `fn Solusi() {
    println!("Solusi");
}`,
    "72": `def Solusi()
    puts "Solusi"     
end`
}

export default function Soal({ data }: { data: DataSoal & { suka_ngk: boolean } }) {
    const [IdBahasaProgram, setIdBahasaProgram] = useState('71');
    const [BahasaProgram, setBahasaProgram] = useState('python');
    const [Output, setOutput] = useState<{ data: HasilJawaban[], lulus: number, gagal: number, waktu: string, status: "Mengirim" | "Sukses" | "" }>({
        data: [{
            hasil: "",
            jawaban: "",
            koreksi: false,
            status: "Sukses"
        }],
        lulus: 0,
        gagal: 1,
        waktu: "",
        status: ""
    });
    // const [Output, setOutput] = useState<{error: string, waktu: string, output: HasilJawaban[], status: "Mengirim" | "Error" | "Sukses" | "", lulus: number, gagal: number}>({
    //     error: "",
    //     waktu: "",
    //     status: "",
    //     lulus: 0,
    //     gagal: 0,
    //     output: [{
    //         status: "",
    //         koreksi: "",
    //         hasil: "",
    //         jawaban: ""
    //     }],
    // });
    const [StatusTekananSoalOutput, setStatusTekananSoalOutput] = useState('soal');
    const [Kode, setKode] = useState(ListKode['71']);
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
        setIdBahasaProgram(e.target.value);
        setBahasaProgram(ListBahasaProgram[e.target.value as keyof typeof ListBahasaProgram])
        setKode(ListKode[e.target.value as keyof typeof ListKode]);
    }

    const StatusKirimOutput = () => {
        setStatusTekananSoalOutput('output');
        setOutput({ ...Output, status: "Mengirim" });
    }

    const KirimJawaban = async (e: BaseSyntheticEvent, statusKlik: "test" | "jawaban") => {
        e.preventDefault();
        KlikOutput();
        StatusKirimOutput();
        const KodeSoal = kodeEditor!.editor.getValue();

        // const hasil: {status: string, output: HasilJawaban[] | undefined, error: string | undefined, waktu: string, lulus: number, gagal: number} = await axios.post("/api/soal/kirimkode", {
        //     kode: kodeEditor!.editor.getValue(),
        //     idBahasaProgram: IdBahasaProgram,
        //     idsoal: data.idsoal
        // }).then(d => d.data);
        const hasil: { data: HasilJawaban[], lulus: number, gagal: number, waktu: string } = await axios.post("/api/soal/kirimkode", {
            kode: KodeSoal,
            idBahasaProgram: IdBahasaProgram,
            idsoal: data.id,
            w: statusKlik
        }).then(d => d.data);

        if (statusKlik === "jawaban") {
            if (hasil.lulus >= hasil.data.map((v) => v.koreksi).length) {
                console.log(KodeSoal)
                setKodeBenar(KodeSoal);
            }
        }

        setOutput({
            data: hasil.data,
            waktu: hasil.waktu,
            lulus: hasil.lulus,
            gagal: hasil.gagal,
            status: "Sukses"
        });

        // switch (hasil.status) {
        //     case "Error":
        //         setOutput({
        //             ...Output,
        //             status: hasil.status,
        //             error: hasil.error!,
        //             waktu: (parseFloat(hasil.waktu) * 1000).toString() + 'ms',
        //         });
        //         break;
        //     case "Sukses":
        //         setOutput({
        //             ...Output,
        //             status: hasil.status,
        //             output: hasil.output!,
        //             waktu: (parseFloat(hasil.waktu) * 1000).toString() + 'ms',
        //             lulus: hasil.lulus,
        //             gagal: hasil.gagal
        //         });
        //         break;
        // }
    }

    if (Object.keys(data).length <= 0) {
        return (
            <div style={{ height: "100%" }}>
                <Navbar />
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
            <Navbar />
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
                                        <button id="tombolpertanyaan" className='me-3 tombolBerikutnya border-0' onClick={KlikPertanyaan}>Pertanyaan</button>
                                        <button id="tomboloutput" className="tombol_aktif bg-transparent border-0" onClick={KlikOutput}>Output</button>
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
                                                const match = /language-(\w+)/.exec(className || '')
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
                                    {(Output.status !== "Mengirim" && Output.status !== "") &&
                                        <div>
                                            <div className="text-white px-3 mt-2">
                                                <span className="me-3">Waktu: {Number(Output.waktu).toFixed(2) + ' detik'}</span>
                                                <span className="me-3 text-success">Lulus: {Output.lulus}</span>
                                                <span className="me-3 text-danger">Gagal: {Output.gagal}</span>
                                            </div>
                                            <hr className="text-white" style={{ marginBottom: "0px" }} />
                                        </div>
                                    }
                                    <div className="px-3">
                                        {Output.status !== "Mengirim" &&
                                            <div className="mt-2">
                                                {/* {Output.status === "Error" &&
                                        <div className="px-3 text-white">
                                            <div className="mb-3">Output Error:</div>
                                            <div className="px-3 py-2 rounded-2" style={{background: "rgb(97, 57, 57)", border: "1px solid rgb(145, 78, 78)", letterSpacing: ".7px"}}> 
                                                {Output.}
                                            </div>
                                        </div>
                                        } */}
                                                {Output.status === "Sukses" &&
                                                    (Output.data.map((v, i) => {
                                                        if (v.koreksi) {
                                                            return (
                                                                <details key={i} className="mb-2 panah text-success">
                                                                    <summary className="mb-2">Test #{i + 1}: Success</summary>
                                                                    <div className="px-3 py-2 rounded-2 text-white" style={{ background: "rgb(35, 102, 53)", border: "1px solid rgb(51, 130, 72)", letterSpacing: ".7px" }}>
                                                                        Output: {v.hasil}, Jawaban: {v.jawaban}
                                                                    </div>
                                                                </details>
                                                            )
                                                        } else {
                                                            return (
                                                                <details key={i} className="mb-2 panah text-danger">
                                                                    <summary className="mb-2">Test #{i + 1}: Gagal</summary>
                                                                    <div className="px-3 py-2 rounded-2 text-white" style={{ background: "rgb(97, 57, 57)", border: "1px solid rgb(145, 78, 78)", letterSpacing: ".7px" }}>
                                                                        {v.status === "Error" ?
                                                                            <p>{new Buffer(v.hasil, 'base64').toString('utf-8')}</p>
                                                                            :
                                                                            <p>Output: {v.hasil}, Jawaban: {v.jawaban}</p>
                                                                        }
                                                                    </div>
                                                                </details>
                                                            )
                                                        }
                                                    }))
                                                }
                                                {Output.lulus >= Output.data.length &&
                                                    <div style={{ color: "#30AD43" }}>
                                                        Selamat, Kamu lulus semua test!
                                                    </div>
                                                }
                                            </div>
                                        }
                                        {Output.status === "Mengirim" &&
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
                                            <option value="71">Python</option>
                                            <option value="63">Javascript</option>
                                            <option value="74">Typescript</option>
                                            <option value="54">C++</option>
                                            <option value="64">Lua</option>
                                            <option value="73">Rust</option>
                                            <option value="72">Ruby</option>
                                        </select>
                                        <button className="tombolBerikutnya" style={{ float: "right" }}>Settings</button>
                                        <button className="tombolBerikutnya me-3" style={{ float: "right" }}>Reset</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2" style={{ height: "calc(100vh - 250px)", minHeight: "200px" }}>
                                <div>
                                    <CodeEditor
                                        mode={ListBahasaProgram[IdBahasaProgram as keyof typeof ListBahasaProgram]}
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
                                        <button className="text-white tombolBerikutnya" style={{ width: "5%" }}>
                                            Import
                                        </button>
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