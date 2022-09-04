import Navbar from "../../components/navbar";
import Background from "../../components/background";
import { BaseSyntheticEvent, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import ReactAce from "react-ace/lib/ace";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Router from "next/router";

const CodeEditor = dynamic(import('../../components/codeEditor'), {ssr: false});

const _contohKodeJawaban = `
def Solusi():
    print('Solusi')
`.trim();

const _contohKodeListJawaban = `
from soalkoding import ApakahSama
from solusi import Solusi
`.trim();

// Can we get much higher

// ~~~javascript
// function MInecraft() {
//     console.log("Roblox")
// }
// ~~~

// So high high

// woa wao wa


// woa wao wa

// can we get mich higher

export default function Buat() {
    const [StatusSoal, setStatusSoal] = useState<"preview" | "soal" | "bantuan">('soal');
    const [StatusKodeJawaban, setStastusKodeJawaban] = useState<"kodejawaban" | "bantuan">('kodejawaban');
    const [StatusJawaban, setStatusJawaban] = useState<"listjawaban" | "contohjawaban" | "bantuan">('listjawaban');
    const [Soal, setSoal] = useState('');
    const [KodeJawaban, setKodeJawaban] = useState('');
    const [KodeListJawaban, setKodeListJawaban] = useState('');
    const [KodeContohJawaban, setKodeContohJawaban] = useState('');

    let SoalKodeEditor: ReactAce | undefined = undefined;
    let JawabanKodeEditor: ReactAce | undefined = undefined;
    let JawabanListEditor: ReactAce | undefined = undefined;
    let ContohJawabanEditor: ReactAce | undefined = undefined;

    const TambahinTags = (e: BaseSyntheticEvent) => {
        const Element = e.target as HTMLButtonElement;
        
        if(Element.className.includes("tombol-tags-aktif")) {
            Element.classList.remove("tombol-tags-aktif");
        } else {
            Element.classList.add("tombol-tags-aktif");
        }

        e.preventDefault();
    }

    const UbahJawabanKeContoh = (hasil: boolean) => {
        if(!hasil) return;
        setKodeJawaban(_contohKodeJawaban);
        setKodeListJawaban(_contohKodeListJawaban);
    }

    useEffect(() => {
        const warningText = 'Soal yang kamu bikin belum disimpan - Yakin mau keluar?';
        const handleWindowClose = (e: BeforeUnloadEvent) => {
            if (false) return;
            e.preventDefault();
            return (e.returnValue = warningText);
        };

        const handleBrowseAway = () => {
            if (window.confirm(warningText)) return;
            Router.events.emit('routeChangeError');
            throw 'routeChange aborted.';
        };

        window.addEventListener('beforeunload', handleWindowClose);
        Router.events.on('routeChangeStart', handleBrowseAway);
        
        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
            Router.events.off('routeChangeStart', handleBrowseAway);
        };
    }, []);

    return (
        <Background>
            <Navbar />
            <style>{`
            .tombol-tags-aktif {
                background-color: rgb(58, 58, 58) !important;
                border-color: rgb(58, 58, 58) !important; 
                color: white !important;
            }

            .tombol-tags {
                padding: 7px;
                padding-right: 10px;
                padding-left: 10px;
                background: transparent;
                color: white;
                border: 1px solid rgb(58, 58, 58);
                border-radius: 5px;
                transition: .2s;
            }

            .tombol-menu {
                padding: 12px;
                background: transparent;
                border: none;
                color: white;
                transition: .2s;
            }

            .tombol-menu:hover {
                background: rgb(40, 40, 40);
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
                padding: 7px;
            }

            .tombolBerikutnya:hover {
                background: rgb(40, 40, 40);
            }

            .bahasaSelect {
                cursor: pointer;
                display: inline-block;
                position: relative;
                font-size: 16px;
                color: #fff;
                width: 220px;
                height: 40px;
                background-color: rgb(48, 48, 48);
                border: 1px solid rgb(80, 80, 80);
            }

            .modalContoh {
                background-color: green;
            }
            `}</style>
            <div className="container-fluid">
                <div className="mb-4 fs-6">
                    <button className="tombol-menu"><i className="bi bi-download"></i> Simpan</button>
                    <button className="tombol-menu"><i className="bi bi-arrow-counterclockwise"></i> Ulang</button>
                    <button className="tombol-menu"><i className="bi bi-trash-fill"></i> Hapus</button>
                </div>
                <div className="row mb-3" style={{height: "30rem"}}>
                    <div className="col-lg-6">
                        <div className="d-flex flex-row mb-3">
                            <button className={'me-3 border-0 ' + (StatusSoal === "soal" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusSoal("soal")}><i className="bi bi-fire"></i> Pertanyaan</button>
                            <button className={"me-3 border-0 " + (StatusSoal === "preview" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusSoal("preview")}><i className="bi bi-patch-exclamation-fill"></i> Output</button>
                            <button className={"tombol_aktif border-0 " + (StatusSoal === "bantuan" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusSoal("bantuan")}><i className="bi bi-question-circle-fill"></i> Bantuan</button>
                        </div>
                        <div style={{height: "85%"}}>
                            {StatusSoal === "soal" &&
                                <CodeEditor
                                    mode={"markdown"}
                                    value={Soal}
                                    onChange={() => setSoal(SoalKodeEditor!.editor.getValue())}
                                    refData={(ins: ReactAce) => {SoalKodeEditor = ins}}
                                    autoComplete={false}
                                />
                            }
                            {StatusSoal === "preview" &&
                                // dangerouslySetInnerHTML={{__html: Soal}}
                                <div className="p-3 text-white fs-5" style={{height: "100%", backgroundColor: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px", whiteSpace: "pre-wrap"}}>
                                    <ReactMarkdown
                                        // eslint-disable-next-line react/no-children-prop
                                        children={ Soal }
                                        components={{
                                        code({node, inline, className, children, ...props}) {
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
                                    {/* {UbahSoal(Soal)} */}
                                </div>
                            }
                            {StatusSoal === "bantuan" && 
                                <div className="text-white p-3 fs-5" style={{height: "100%", backgroundColor: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px"}}>
                                    <h3>Pembuatan Soal</h3>
                                    <p className="fs-5">{`Dalam pembuatan soal, Bisa dibuat dengan bahasa Markdown dan untuk menggunakan Code snippet bisa menggunakan Tag (~~~), Contohnya: `}</p>
                                    <pre className="fs-5 p-3" style={{background: "rgb(30, 30, 30)", whiteSpace: "pre-wrap", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px"}}>{`~~~javascript
function Solusi() {
return "Solusinya mana";
}
~~~`}</pre>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <form>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control text-white" placeholder="contoh@gmail.com" style={{height: "calc(2.5rem + 2px)", lineHeight: "3", backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(58, 58, 58)"}}/>
                                <label className="text-white-50" htmlFor="floatingInput" style={{padding: "0.5rem 0.75rem"}}>Nama soal</label>
                            </div>
                            <div className="mb-3">
                                <select defaultValue="0" className="form-control text-white" style={{backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(58, 58, 58)"}}>
                                    <option value="0" hidden>Level</option>
                                    <option value="1">Level 1</option>
                                    <option value="2">Level 2</option>
                                    <option value="3">Level 3</option>
                                    <option value="4">Level 4</option>
                                    <option value="5">Level 5</option>
                                </select>
                            </div>
                            <div>
                                <button type="button" className="me-2 tombol-tags" onClick={TambahinTags}>Algortima</button>
                                <button type="button" className="me-2 tombol-tags" onClick={TambahinTags}>Array</button>
                                <button type="button" className="me-2 tombol-tags" onClick={TambahinTags}>Sorting</button>
                                <button type="button" className="me-2 tombol-tags" onClick={TambahinTags}>Dasar</button>
                                <button type="button" className="me-2 tombol-tags" onClick={TambahinTags}>Matriks</button>
                                <button type="button" className="me-2 tombol-tags" onClick={TambahinTags}>Matematika</button>
                                <button type="button" className="me-2 tombol-tags" onClick={TambahinTags}>Logika</button>
                                <button type="button" className="me-2 tombol-tags" onClick={TambahinTags}>RegEx</button>
                                <button type="button" className="me-2 tombol-tags" onClick={TambahinTags}>String</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mb-3">
                    <select className="bahasaSelect">
                        <option value="71">Python</option>
                        <option value="63">Javascript</option>
                        <option value="74">Typescript</option>
                        <option value="54">C++</option>
                        <option value="64">Lua</option>
                        <option value="73">Rust</option>
                        <option value="72">Ruby</option>
                    </select>
                    <button className="btn btn-outline-primary float-end" onClick={() => UbahJawabanKeContoh(confirm('Soal yang kamu tulis akan diubah menjadi soal yang sudah diberikan contoh, Apa kamu yakin ingin mengubahnya?'))}>
                        <i className="bi bi-journal-code"></i>
                        {` Contoh Soal`}
                    </button>
                    <button className="btn btn-outline-success float-end me-3">
                        <i className="bi bi-check-all"></i>
                        {` Konfirmasi Jawaban`}
                    </button>
                </div>
                <div className="row" style={{height: "30rem"}}>
                    <div className="col-6">
                        <div className="mb-3">
                            <button className={'me-3 border-0 ' + (StatusKodeJawaban === "kodejawaban" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStastusKodeJawaban("kodejawaban")}><i className="bi bi-code-square"></i> Kode Jawaban</button>
                            <button className={"tombol_aktif border-0 " + (StatusKodeJawaban === "bantuan" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStastusKodeJawaban("bantuan")}><i className="bi bi-question-circle-fill"></i> Bantuan</button>
                        </div>
                        {StatusKodeJawaban === "kodejawaban" &&
                            <CodeEditor
                                mode={"python"}
                                value={KodeJawaban}
                                onChange={() => setKodeJawaban(JawabanKodeEditor!.editor.getValue())}
                                refData={(ins: ReactAce) => {JawabanKodeEditor = ins}}
                                autoComplete={true}
                            />
                        }
                        {StatusKodeJawaban === "bantuan" &&
                            <div className="h-100 text-white p-3 fs-5" style={{backgroundColor: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px"}}>
                                <h3>Cara kerja kode jawaban</h3>
                                <p>Tulis kode solusi jawaban pembuatan soal kamu</p>
                            </div>
                        }
                    </div>
                    <div className="col-6">
                        <div className="mb-3">
                            <button className={'me-3 border-0 ' + (StatusJawaban === "listjawaban" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusJawaban("listjawaban")}><i className="bi bi-droplet-fill"></i> List Jawaban</button>
                            <button className={"me-3 border-0 " + (StatusJawaban === "contohjawaban" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusJawaban("contohjawaban")}><i className="bi bi-exclamation-octagon-fill"></i> Contoh Jawaban</button>
                            <button className={"tombol_aktif border-0 " + (StatusJawaban === "bantuan" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusJawaban("bantuan")}><i className="bi bi-question-circle-fill"></i> Bantuan</button>
                        </div>
                        {StatusJawaban === "listjawaban" &&
                            <CodeEditor
                                mode={"python"}
                                value={KodeListJawaban}
                                onChange={() => setKodeListJawaban(JawabanListEditor!.editor.getValue())}
                                refData={(ins: ReactAce) => {JawabanListEditor = ins}}
                                autoComplete={true}
                            />
                        }
                        {StatusJawaban === "contohjawaban" &&
                            <CodeEditor
                                mode={"python"}
                                value={KodeContohJawaban}
                                onChange={() => setKodeContohJawaban(ContohJawabanEditor!.editor.getValue())}
                                refData={(ins: ReactAce) => {ContohJawabanEditor = ins}}
                                autoComplete={true}
                            />
                        }
                        {StatusJawaban === "bantuan" &&
                            <div className="h-100 text-white p-3 fs-5" style={{backgroundColor: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px"}}>
                                <h3>Cara kerja kode jawaban</h3>
                                <p>Tulis kode solusi jawaban pembuatan soal kamu</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Background>
    )
}