import Navbar from "../../../../components/navbar";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import axios from "axios";
import { NextApiRequest } from "next";
import { DataSolusi } from "../../../../types/tipe";
import { useState } from "react";

const TemplateKoding = `
function Roblox() {
    console.log("Minecraft adalah game yang terbaik");
    console.log("Minecraft adalah game yang terbaik");
    console.log("Minecraft adalah game yang terbaik");
    console.log("Minecraft adalah game yang terbaik");
    console.log("Minecraft adalah game yang terbaik");
    console.log("Minecraft adalah game yang terbaik");
    console.log("Minecraft adalah game yang terbaik");
    console.log("Minecraft adalah game yang terbaik");
    console.log("Minecraft adalah game yang terbaik");
    console.log("Minecraft adalah game yang terbaik");
}
`.trim()

export async function getServerSideProps(konteks: { params: { soal: string }, req: NextApiRequest }) {
    const data = await axios.post(`http://${konteks.req.headers.host}/api/soal/solusi/dapatinSolusi`, {
        idsoal: konteks.params.soal
    }, {
        headers: { cookie: konteks.req.headers.cookie } as any
    }).then(d => d.data);

    return {
        props: {
            data
        }
    }
}

export default function Solusi({ data }: { data: DataSolusi }) {
    const [Favorit, setFavorit] = useState<{ suka_ngk: boolean, berapa: number }>({
        suka_ngk: data.suka_ngk,
        berapa: JSON.parse(data.soal.suka).length
    });

    const FavoritSoal = async () => {
        const _data = await axios.post("/api/soal/favorit", {
            idsoal: data.idsoal
        }).then(d => d.data);

        setFavorit({
            suka_ngk: _data.suka_ngk,
            berapa: _data.berapa
        })
    }

    const KlikKepintaran = async (elementTombol: MouseEvent, idsolusi: string) => {
        const _data = await axios.post("/api/soal/solusi/pintar", {
            idsoal: data.idsoal,
            idsolusi,
        }).then(d => d.data);

        if(_data.suka_ngk) {
            (elementTombol.target as any).style.borderColor = 'white';
            (elementTombol.target as any).style.color = 'white';
        } else {
            (elementTombol.target as any).style.borderColor = 'rgb(150, 150, 150)';
            (elementTombol.target as any).style.color = 'rgb(170, 170, 170)';
        }
        document.getElementById(_data.idsolusi)!.innerText = _data.berapa;
    }

    return (
        <div className="px-3">
            <Navbar />
            <style jsx>{`
            .tombol-kerjakan {
                background: rgb(45, 45, 45);
                border: 1px solid #306634;
                padding: 5px 10px;
                color: #408845;
                transition: .2s;
            }

            .tombol-kerjakan:hover {
                color: #50aa57;
                border-color: #50aa57;
            }

            .tombol-soalberikutnya {
                background: rgb(45, 45, 45);
                border: 1px solid #079c96;
                padding: 5px 10px;
                color: #079c96;
                transition: .2s;
            }

            .tombol-soalberikutnya:hover {
                border-color: #09c8c1;
                color: #09c8c1;
            }

            .tombol-puas {
                background: transparent;
                border: 1px solid rgb(150, 150, 150);
                color: white;
                transition: 2s;
            }

            .tombol-keren {
                background: rgb(50, 50, 50);
                color: rgb(170, 170, 170);
                border: 1px solid rgb(150, 150, 150);
                transition: 0.2s;
            }

            .tombol-keren:hover { 
                color: white !important;
            }

            .radio-container {
                display: block;
                position: relative;
                cursor: pointer;
                color: rgb(200, 200, 200);
                user-select: none;
            }

            .radio-container input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
            }              
            
            .checkmark {
                position: absolute;
                top: 7px;
                left: 0px;
                height: 13px;
                width: 13px;
                background-color: rgb(50, 50, 50);
                border-radius: 50%;
            } 

            .radio-container input:checked ~ .checkmark {
                background-color: #2196F3;
            }

            .checkmark:after {
                position: absolute;
                display: none;
            }

            .radio-container input:checked ~ .checkmark:after {
                display: block;
            }

            .filter-jawaban {
                background: rgb(60, 60, 60);
                position: -webkit-sticky;
                position: sticky;
                top: 10px;
            }
              
            /* Style the indicator (dot/circle) */
            .radio-container .checkmark:after {
                top: 8px;
                left: 8px;
                width: 11px;
                height: 11px;
                border-radius: 50%;
                background: white;
            }

            .favorit:hover {
                color: rgb(180, 180, 180);
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

            <div className="p-3 text-white rounded-1 mb-2" style={{ background: "rgb(48, 48, 48)" }}>
                <div className="row">
                    <div className="col">
                        <div className="mb-2">
                            <span className="me-3">{data.soal.namasoal}</span>
                            <span className="p-2 fs-6 me-2" style={{ background: "rgb(55, 55, 55)" }}>Level {data.soal.level}</span>
                            <i className="bi bi-check-lg"></i>
                        </div>
                        <div className="mb-1">
                            <span className="me-3">
                                <i className="bi bi-person-fill me-2"></i>
                                <a className="text-decoration-none text-white" href="#">{data.soal.pembuat}</a>
                            </span>
                            <span className="me-4 favorit" onClick={FavoritSoal}>
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
                        </div>
                    </div>
                    <div className="col">
                        <div className="d-flex flex-row justify-content-end h-100">
                            <button className="align-self-center tombol-kerjakan me-2">Kerjakan</button>
                            <button className="align-self-center tombol-soalberikutnya">Soal berikutnya <i className="bi bi-caret-right-fill"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="p-3 rounded-1 text-white mb-2" style={{ background: 'rgb(60, 60, 60)' }}>
                <span className="me-3">Seberapa puasnya kamu dengan soal ini?</span>
                <button className="me-2 tombol-puas">Tidak puas</button>
                <button className="me-2 tombol-puas">Biasa</button>
                <button className="me-2 tombol-puas">Sangat puas</button>
            </div> */}
            <div className="row">
                <div className="col-10">
                    {data.solusi.map((v, i) => {
                        return (
                            <div key={i} className="p-3 mb-3 rounded-2" style={{ background: "rgb(48, 48, 48)" }}>
                                <div className="d-flex">
                                    <div className="text-white flex-grow-1">
                                        <i className="bi bi-person me-1"></i>
                                        {v.username}
                                    </div>
                                    <div className="text-white-50">
                                        {new Date(v.bikin).getDate() + '/' + new Date(v.bikin).getMonth() + '/' + new Date(v.bikin).getFullYear()}
                                    </div>
                                </div>
                                <div className="px-2 mb-3">
                                    <SyntaxHighlighter customStyle={{ maxHeight: "200px" }} language={v.bahasa} style={tomorrow as any}>{v.kode}</SyntaxHighlighter>
                                </div>
                                <div>
                                    <button className="tombol-keren me-3" style={{"borderColor": (v.apakahSudahPintar ? 'white' : 'rgb(150, 150, 150)'), "color": (v.apakahSudahPintar ? 'white' : 'rgb(170, 170, 170)')}} onClick={(e) => KlikKepintaran(e as any, v.id)}>
                                        <i className="bi bi-arrow-up-short"></i>
                                        Pintar
                                        <span className={"ms-2"} id={v.id}>{JSON.parse(v.pintar).length}</span>
                                    </button>
                                    <a href={`/soal/${v.idsoal}/solusi/${v.idsolusi}`} className="border-0 text-decoration-none" style={{ background: 'transparent', color: 'rgb(160, 160, 160)' }}>
                                        <i className="bi bi-chat-right-fill me-2 fs-5"></i>
                                        {JSON.parse(v.komentar).length}
                                    </a>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="col">
                    <div className="p-2 rounded-1 filter-jawaban">
                        <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Lihat</div>
                        <fieldset className="mb-2" id="lihat">
                            <label className="radio-container">
                                <input type="radio" name="lihat" value="semua" />
                                <span style={{ marginLeft: "20px" }}>Semua</span>
                                <span className="checkmark"></span>
                            </label>
                            <label className="radio-container">
                                <input type="radio" name="lihat" value="sendiri" />
                                <span style={{ marginLeft: "20px" }}>Sendiri</span>
                                <span className="checkmark"></span>
                            </label>
                        </fieldset>
                        <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Berdasarkan</div>
                        <fieldset id="berdasarkan">
                            <label className="radio-container">
                                <input type="radio" name="berdasarkan" value="kepintaran" />
                                <span style={{ marginLeft: "20px" }}>Kepintaran</span>
                                <span className="checkmark"></span>
                            </label>
                            <label className="radio-container">
                                <input type="radio" name="berdasarkan" value="baru" />
                                <span style={{ marginLeft: "20px" }}>Baru</span>
                                <span className="checkmark"></span>
                            </label>
                            <label className="radio-container">
                                <input type="radio" name="berdasarkan" value="lama" />
                                <span style={{ marginLeft: "20px" }}>Lama</span>
                                <span className="checkmark"></span>
                            </label>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    )
}