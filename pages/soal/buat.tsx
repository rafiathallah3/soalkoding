import Navbar from "../../components/navbar"
import Background from "../../components/background"
import { BaseSyntheticEvent, useState} from "react"
import dynamic from "next/dynamic";
import ReactAce from "react-ace/lib/ace";
import Kode from "../../components/KodeSnippets";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const CodeEditor = dynamic(import('../../components/codeEditor'), {ssr: false});

export default function Buat() {
    const [StatusSoal, setStatusSoal] = useState<"preview" | "soal" | "bantuan">('soal');
    const [Soal, setSoal] = useState('');

    let kodeEditor: ReactAce | undefined = undefined;
    
    const UbahSoal = (rawSoal: string) => {
        const s = rawSoal.indexOf('```');

        if(s !== -1) {
            let x = rawSoal.replace('```', '');
            const z = x.lastIndexOf('```');

            if(z !== -1) {
                const [bahasa, ...text] = x.substring(s, z).trim().split('\n');
                return (
                    <Kode bahasa={bahasa}>
                        {text.toString().replaceAll(',', '\n')}
                    </Kode>
                )
            }
        }

        return (<div>Belum</div>)
    }

    const TambahinTags = (e: BaseSyntheticEvent) => {
        const Element = e.target as HTMLButtonElement;
        
        if(Element.className.includes("tombol-tags-aktif")) {
            Element.classList.remove("tombol-tags-aktif");
        } else {
            Element.classList.add("tombol-tags-aktif");
        }

        e.preventDefault();
    }

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
            `}</style>
            <div className="container-fluid">
                <div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="d-flex flex-row mb-3">
                                <button className={'me-3 border-0 ' + (StatusSoal === "soal" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusSoal("soal")}><i className="bi bi-fire"></i> Pertanyaan</button>
                                <button className={"me-3 border-0 " + (StatusSoal === "preview" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusSoal("preview")}><i className="bi bi-patch-exclamation-fill"></i> Output</button>
                                <button className={"tombol_aktif border-0 " + (StatusSoal === "bantuan" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusSoal("bantuan")}><i className="bi bi-question-circle-fill"></i> Bantuan</button>
                            </div>
                            <div style={{height: "25rem"}}>
                                {StatusSoal === "soal" &&
                                    <div style={{height: "100%"}}>
                                        <CodeEditor
                                            mode={"markdown"}
                                            value={Soal}
                                            onChange={() => {setSoal(kodeEditor!.editor.getValue()); UbahSoal(kodeEditor!.editor.getValue())}}
                                            refData={(ins: ReactAce) => {kodeEditor = ins}}
                                            autoComplete={false}
                                        />
                                    </div>
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
                                    <input type="text" className="form-control text-white" placeholder="name@example.com" style={{height: "calc(2.5rem + 2px)", lineHeight: "3", backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(58, 58, 58)"}}/>
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
                </div>
                <div>

                </div>
                <div>

                </div>
            </div>
        </Background>
    )
}