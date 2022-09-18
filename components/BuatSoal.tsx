import Navbar from "../components/navbar";
import Background from "../components/background";
import { BaseSyntheticEvent, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import ReactAce from "react-ace/lib/ace";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Router from "next/router";
import axios from "axios";

interface TipeKonfirmasiJawaban {
    hasil: any
    jawaban: any
    koreksi: boolean
    status: "Sukses" | "Error"
    error?: string
}

const CodeEditor = dynamic(import('../components/codeEditor'), {ssr: false});

const _contohKodeJawaban = `
def Solusi(angka, list_bulatan):
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
`.trim();

const _contohKodeListJawaban = `
ApakahSama(Solusi, ([2, 3, 5], [10, 9, 17]), [2, 3, 4])
ApakahSama(Solusi, ([5, 8, 9], [6, 13]), [0, 2])
ApakahSama(Solusi, ([10,10,10], [20, 35, 50]), [2, 0, 5])
`.trim();

const _contohJawaban = `
ApakahSama(Solusi, ([2, 3, 5], [10, 9, 17]), [2, 3, 4])
ApakahSama(Solusi, ([10,10,10], [20, 35, 50])
`.trim()

const _contohSoal = `
Diberikan kalkulator, tetapi kalkulator tersebut hanya memiliki 3 angka yaitu a, b, dan c.
Kalkulator tersebut hanya bisa menggunakan operasi tambah. Kemudian diberikan sejumlah Q
bilangan bulat n. Tantangannya mudah saja. Dari bilangan bulat n tersebut, carilah jumlah
minimum angka yang perlu ditekan agar kalkulator bisa menampilkan bilangan bulat n.

Catatan: Kalau angka kalkulator tidak bisa menghasilkan angka yang ditentukan maka return 0 dan angka kalkulator tidak akan berisi 0.

Input: 
1. List angka kalkulator
2. List angka yang ditentukan dari angka kalkulator

Contohnya:
~~~python
Solusi([2, 3, 5], [10, 9, 17]) # -> [2, 3, 4]
# Baris pertama dapat 10 dapat dibentuk minimum dengan 2 nomor (5 + 5)
# Baris kedua dapat 9 dapat dibentuk minimum dengan 3 nomor (3 + 3 + 3)
# Baris Ketiga 17 dapat dibentuk minimum dengan 4 nomor (5 + 5 + 5 + 2)

Solusi([5, 8, 9], [6, 13]) # -> [0, 2]
# Baris pertama dapat 0 karena tidak ada angka yang bisa menghasilkan 6
# Baris kedua 13 dapat dibentuk minimum dengan 2 nomor (5 + 9)

~~~
 
`.trim();

const _contohLiatajawaban = `
def Solusi(angka, list_bulatan):
    ...
`.trim();

export default function Buat() {
    const [StatusSoal, setStatusSoal] = useState<"preview" | "soal" | "bantuan">('soal');
    const [StatusKodeJawaban, setStastusKodeJawaban] = useState<"kodejawaban" | "liatkode" | "output" | "bantuan">('kodejawaban');
    const [StatusJawaban, setStatusJawaban] = useState<"listjawaban" | "contohjawaban" | "bantuan">('listjawaban');
    const [Soal, setSoal] = useState('');
    const [KodeJawaban, setKodeJawaban] = useState('');
    const [LiatanKodeJawaban, setLiatanKodeJawaban] = useState('');
    const [KodeListJawaban, setKodeListJawaban] = useState('');
    const [KodeContohJawaban, setKodeContohJawaban] = useState('');
    const [OutputKonfirmasiJawaban, setOutputKonfirmasiJawaban] = useState<TipeKonfirmasiJawaban[]>();
    const [TagsDitambahin, setTagsDitambahin] = useState<string[]>([]);
    const [KurangData, setKurangData] = useState('');

    let SoalKodeEditor: ReactAce | undefined = undefined;
    let JawabanKodeEditor: ReactAce | undefined = undefined;
    let JawabanListEditor: ReactAce | undefined = undefined;
    let ContohJawabanEditor: ReactAce | undefined = undefined;
    let LiatanKodeJawabanEditor: ReactAce | undefined = undefined;
    
    const TambahinTags = (e: BaseSyntheticEvent) => {
        e.preventDefault();
        
        const Element = e.target as HTMLButtonElement;
        
        if(Element.className.includes("tombol-tags-aktif")) {
            const listBaru = TagsDitambahin.filter((v) => v != Element.innerText);
            setTagsDitambahin(listBaru);
            Element.classList.remove("tombol-tags-aktif");
        } else {
            if(TagsDitambahin.length >= 3) return;

            setTagsDitambahin([...TagsDitambahin, Element.innerText])
            Element.classList.add("tombol-tags-aktif");
        }
    }

    const UbahJawabanKeContoh = (hasil: boolean) => {
        if(!hasil) return;
        setKodeJawaban(_contohKodeJawaban);
        setKodeListJawaban(_contohKodeListJawaban);
        setSoal(_contohSoal);
        setLiatanKodeJawaban(_contohLiatajawaban);
        setKodeContohJawaban(_contohJawaban);
    }

    const KonfirmasiJawaban = async () => {
        const d: {data: TipeKonfirmasiJawaban[]} = await axios.post("/api/soal/buat/kirimjawaban", {
            kode: KodeJawaban,
            listJawaban: KodeListJawaban,
            eksekusiKode: "" //Nanti kita buatkan untuk security reason
        }).then(v => v.data);

        setOutputKonfirmasiJawaban(d.data);
        setStastusKodeJawaban("output");
    }

    const KirimBuatanSoal = async () => {
        const NamaSoal = (document.getElementById("NamaSoal") as HTMLInputElement).value;
        const Level = (document.getElementById("LevelSoal") as HTMLInputElement).value;
        if(NamaSoal === "" || Level === "0" || TagsDitambahin.length <= 0) {
            setKurangData("Form tidak boleh kosong");
            return
        }

        if(Soal === "") {
            setKurangData("Soal tidak boleh kosong");
        }

        const d: { id: string } = await axios.post("/api/soal/buat/buatsoal", {
            NamaSoal,
            Level,
            Tags: TagsDitambahin,
            Soal
        }).then(d => d.data);

        location.href = `/soal/${d.id}/latihan`
    }

    const UlangSoal = () => {
        setKodeJawaban("");
        setKodeListJawaban("");
        setSoal("");
        setLiatanKodeJawaban("");
        setKodeContohJawaban("");
        setOutputKonfirmasiJawaban(undefined);
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

            .footer_a {
                color: white;
                transition: .2s;
            }

            .footer_a:hover {
                color: rgb(200, 200, 200);
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
            <div className="container-fluid">
                {KurangData !== "" &&
                    <div className="p-2 fs-6 text-white" style={{background: "#e35252"}}>
                        {KurangData}
                        <button className="float-end me-2 bg-transparent border-0 text-white" onClick={() => setKurangData("")}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                }
                <div className="mb-4 fs-6">
                    <button className="tombol-menu" onClick={KirimBuatanSoal}><i className="bi bi-download"></i> Simpan</button>
                    <button className="tombol-menu" onClick={UlangSoal}><i className="bi bi-arrow-counterclockwise"></i> Ulang</button>
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
                                <div style={{height: "420px", minHeight: "200px"}}>
                                    <CodeEditor
                                        mode={"markdown"}
                                        value={Soal}
                                        onChange={() => setSoal(SoalKodeEditor!.editor.getValue())}
                                        refData={(ins: ReactAce) => {SoalKodeEditor = ins}}
                                        autoComplete={false}
                                    />
                                </div>
                            }
                            {StatusSoal === "preview" &&
                                <div className="p-3 text-white" style={{height: "420px", minHeight: "200px", fontSize: "18px", backgroundColor: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin"}}>
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
                                <input type="text" id="NamaSoal" className="form-control text-white" placeholder="Soal" style={{height: "calc(2.5rem + 2px)", lineHeight: "3", backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(58, 58, 58)"}}/>
                                <label className="text-white-50" htmlFor="floatingInput" style={{padding: "0.5rem 0.75rem"}}>Nama soal</label>
                            </div>
                            <div className="mb-3">
                                <select defaultValue="0" id="LevelSoal" className="form-control text-white" style={{backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(58, 58, 58)"}}>
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
                            <p className="text-white-50">Maximum 3 tags</p>
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
                    <button className="btn btn-outline-success float-end me-3" onClick={KonfirmasiJawaban}>
                        <i className="bi bi-check-all"></i>
                        {` Konfirmasi Jawaban`}
                    </button>
                </div>
                <div className="row mb-5" style={{height: "30rem"}}>
                    <div className="col-6">
                        <div className="mb-3">
                            <button className={'me-3 border-0 ' + (StatusKodeJawaban === "kodejawaban" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStastusKodeJawaban("kodejawaban")}><i className="bi bi-code-square"></i> Kode Jawaban</button>
                            <button className={'me-3 border-0 ' + (StatusKodeJawaban === "liatkode" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStastusKodeJawaban("liatkode")}><i className="bi bi-bullseye"></i> Liatan kode</button>
                            <button className={'me-3 border-0 ' + (StatusKodeJawaban === "output" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStastusKodeJawaban("output")}><i className="bi bi-patch-exclamation-fill"></i> Output</button>
                            <button className={"tombol_aktif border-0 " + (StatusKodeJawaban === "bantuan" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStastusKodeJawaban("bantuan")}><i className="bi bi-question-circle-fill"></i> Bantuan</button>
                        </div>
                        <div style={{height: "85%"}}>
                            {StatusKodeJawaban === "kodejawaban" &&
                                <div style={{height: "420px", minHeight: "200px"}}>
                                    <CodeEditor
                                        mode={"python"}
                                        value={KodeJawaban}
                                        onChange={() => setKodeJawaban(JawabanKodeEditor!.editor.getValue())}
                                        refData={(ins: ReactAce) => {JawabanKodeEditor = ins}}
                                    />
                                </div>
                            }
                            {StatusKodeJawaban === "liatkode" &&
                                <div style={{height: "420px", minHeight: "200px"}}>
                                    <CodeEditor
                                        mode={"python"}
                                        value={LiatanKodeJawaban}
                                        onChange={() => setLiatanKodeJawaban(LiatanKodeJawabanEditor!.editor.getValue())}
                                        refData={(ins: ReactAce) => {LiatanKodeJawabanEditor = ins}}
                                    />
                                </div>
                            }
                            {StatusKodeJawaban === "output" &&
                                <div className="mb-3" style={{height: "420px", background: "rgb(38, 38, 38)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px", whiteSpace: "pre-wrap", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin"}}>
                                    <div className="px-3">
                                        <div className="mt-2">
                                            {OutputKonfirmasiJawaban?.map((v, i) => {
                                                if(v.status === "Sukses") {
                                                    return (v.koreksi ?
                                                    <details className="mb-2 panah text-success">
                                                        <summary className="mb-2">Test {i+1}: Success</summary>
                                                        <div className="px-3 py-2 rounded-2 text-white" style={{background: "rgb(35, 102, 53)", border: "1px solid rgb(51, 130, 72)", letterSpacing: ".7px"}}> 
                                                            Output: {v.hasil}, Jawaban: {v.jawaban}
                                                        </div>
                                                    </details>
                                                    :
                                                    <details className="mb-2 panah text-danger">
                                                        <summary className="mb-2">Test {i+1}: Gagal</summary>
                                                        <div className="px-3 py-2 rounded-2 text-white" style={{background: "rgb(97, 57, 57)", border: "1px solid rgb(145, 78, 78)", letterSpacing: ".7px"}}> 
                                                            Output: {v.hasil}, Jawaban: {v.jawaban}
                                                        </div>
                                                    </details>
                                                    );
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>
                            }
                            {StatusKodeJawaban === "bantuan" &&
                                <div className="text-white p-3 fs-5" style={{height: "420px", backgroundColor: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px"}}>
                                    <h3>Cara kerja kode jawaban</h3>
                                    <p>Tulis kode solusi jawaban pembuatan soal kamu</p>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="mb-3">
                            <button className={'me-3 border-0 ' + (StatusJawaban === "listjawaban" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusJawaban("listjawaban")}><i className="bi bi-droplet-fill"></i> List Jawaban</button>
                            <button className={"me-3 border-0 " + (StatusJawaban === "contohjawaban" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusJawaban("contohjawaban")}><i className="bi bi-exclamation-octagon-fill"></i> Contoh Jawaban</button>
                            <button className={"tombol_aktif border-0 " + (StatusJawaban === "bantuan" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusJawaban("bantuan")}><i className="bi bi-question-circle-fill"></i> Bantuan</button>
                        </div>
                        <div style={{height: "85%"}}>
                            {StatusJawaban === "listjawaban" &&
                                <div style={{height: "420px"}}>
                                    <CodeEditor
                                        mode={"python"}
                                        value={KodeListJawaban}
                                        onChange={() => setKodeListJawaban(JawabanListEditor!.editor.getValue())}
                                        refData={(ins: ReactAce) => {JawabanListEditor = ins}}
                                    />
                                </div>
                            }
                            {StatusJawaban === "contohjawaban" &&
                                <div style={{height: "420px"}}>
                                    <CodeEditor
                                        mode={"python"}
                                        value={KodeContohJawaban}
                                        onChange={() => setKodeContohJawaban(ContohJawabanEditor!.editor.getValue())}
                                        refData={(ins: ReactAce) => {ContohJawabanEditor = ins}}
                                    />
                                </div>
                            }
                            {StatusJawaban === "bantuan" &&
                                <div className="text-white p-3 fs-5" style={{height: "420px", backgroundColor: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px"}}>
                                    <h3>Cara kerja kode jawaban</h3>
                                    <p>Tulis kode solusi jawaban pembuatan soal kamu</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <footer className="text-white text-center p-2">
                    <ul className="list-unstyled">
                        <li className="d-inline me-3">(C) 2022 Soalkoding</li>
                        <li className="d-inline me-3"><a className="text-decoration-none text-white" href="#">Dashboard</a></li>
                        <li className="d-inline me-3"><a className="text-decoration-none text-white" href="#">Utama</a></li>
                        <li className="d-inline me-3"><a className="text-decoration-none text-white" href="#">Kontak</a></li>
                    </ul>
                </footer>
            </div>
        </Background>
    )
}