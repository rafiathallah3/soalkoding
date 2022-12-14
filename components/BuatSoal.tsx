import Navbar from "../components/navbar";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ReactAce from "react-ace/lib/ace";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import axios from "axios";
import { DataSoal, HasilKompiler, KumpulanBahasaProgram, TipeInfoKode, TipeProfile, WarnaStatus } from "../types/tipe";
import { DapatinContohSoal } from "../services/TemplateBahasaProgram";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

const CodeEditor = dynamic(import('../components/codeEditor'), { ssr: false });

export default function Buat({ mode, data, profile }: { mode: "buat" | "edit", data?: DataSoal, profile: TipeProfile }) {
    const [StatusSoal, setStatusSoal] = useState<"preview" | "soal" | "bantuan">('soal');
    const [StatusKodeJawaban, setStastusKodeJawaban] = useState<"kodejawaban" | "liatkode" | "output" | "bantuan">('kodejawaban');
    const [StatusJawaban, setStatusJawaban] = useState<"listjawaban" | "contohjawaban" | "bantuan">('listjawaban');
    const [Soal, setSoal] = useState(data === undefined ? "" : data.soal);
    const [Public, setPublic] = useState(data === undefined ? false : data.public);
    const [InfoKode, setInfoKode] = useState<{ [bahasa: string]: TipeInfoKode }>(data === undefined ? {
        python: {
            bahasa: "python",
            jawabankode: "",
            liatankode: "",
            listjawaban: "",
            contohjawaban: "",
        }
    } : data.kumpulanjawaban.reduce((p: any, c) => (p[c.bahasa] = c, p), {}));
    const [TagsDitambahin, setTagsDitambahin] = useState<string[]>(data === undefined ? [] : JSON.parse(data.tags));
    const [KurangData, setKurangData] = useState('');
    const [BahasaProgram, setBahasaProgram] = useState<KumpulanBahasaProgram>('python');
    const [Notif, setNotif] = useState<{ status: string, pesan: string } | undefined>(undefined);
    const [SudahDiSave, setSudahDiSave] = useState(true);
    const [OutputKonfirmasiJawaban, setOutputKonfirmasiJawaban] = useState<HasilKompiler>({
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

    let SoalKodeEditor: ReactAce | undefined = undefined;
    let JawabanKodeEditor: ReactAce | undefined = undefined;
    let JawabanListEditor: ReactAce | undefined = undefined;
    let ContohJawabanEditor: ReactAce | undefined = undefined;
    let LiatanKodeJawabanEditor: ReactAce | undefined = undefined;

    const router = useRouter();

    const TambahinTags = (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const Element = e.target as HTMLButtonElement;

        if (Element.className.includes("tombol-tags-aktif")) {
            const listBaru = TagsDitambahin.filter((v) => v != Element.innerText);
            setTagsDitambahin(listBaru);
            Element.classList.remove("tombol-tags-aktif");
        } else {
            if (TagsDitambahin.length >= 3) return;

            setTagsDitambahin([...TagsDitambahin, Element.innerText])
            Element.classList.add("tombol-tags-aktif");
        }
    }

    const UbahJawabanKeContoh = (hasil: boolean) => {
        if (!hasil) return;
        const HasilContohSoal = DapatinContohSoal(BahasaProgram);
        if (HasilContohSoal === undefined) return;
        setInfoKode({
            ...InfoKode,
            [BahasaProgram]: {
                bahasa: BahasaProgram,
                jawabankode: HasilContohSoal.Kode,
                liatankode: HasilContohSoal.LiatanKode,
                listjawaban: HasilContohSoal.ListJawaban,
                contohjawaban: HasilContohSoal.ContohJawaban,
            }
        });
    }

    const KonfirmasiJawaban = async () => {
        try {
            setOutputKonfirmasiJawaban({ ...OutputKonfirmasiJawaban, statuskompiler: "Mengirim" });
            setStastusKodeJawaban("output");
            const d: HasilKompiler = await axios.post("/api/soal/konfirmasikode", {
                buat: JSON.stringify(InfoKode),
                kode: InfoKode[BahasaProgram].jawabankode,
                listjawaban: InfoKode[BahasaProgram].listjawaban,
                bahasa: BahasaProgram,
                eksekusiKode: "" //Nanti kita buatkan untuk security reason, Maksudnya apa securit reason rafi yang duluuuu 13:15 01/11/2022
            }).then(v => v.data);

            setOutputKonfirmasiJawaban({ ...d, statuskompiler: "Sukses" });
        } catch (e) {
            console.log(e);
            setOutputKonfirmasiJawaban({
                error: "Ada masalah kompiler",
                statuskompiler: "Sukses"
            } as any)
        }
    }

    const KirimBuatanSoal = async () => {
        const NamaSoal = (document.getElementById("NamaSoal") as HTMLInputElement).value;
        const Level = (document.getElementById("LevelSoal") as HTMLInputElement).value;
        if (NamaSoal === "" || Level === "0" || TagsDitambahin.length <= 0) {
            setKurangData("Form tidak boleh kosong");
            return
        }

        if (Soal === "") {
            setKurangData("Soal tidak boleh kosong");
        }

        const d: { id: string } = await axios.post("/api/soal/buat/buatsoal", {
            namasoal: NamaSoal,
            level: Level,
            tags: JSON.stringify(TagsDitambahin),
            soal: Soal,
            infokode: JSON.stringify(InfoKode),
        }).then(d => d.data);
        setSudahDiSave(true);

        router.push(`/soal/${d.id}/edit`);
    }

    const UpdateBuatanSoal = async () => {
        const NamaSoal = (document.getElementById("NamaSoal") as HTMLInputElement).value;
        const Level = (document.getElementById("LevelSoal") as HTMLInputElement).value;
        if (NamaSoal === "" || Level === "0" || TagsDitambahin.length <= 0) {
            setKurangData("Form tidak boleh kosong");
            return
        }

        if (Soal === "") {
            setKurangData("Soal tidak boleh kosong");
        }

        const d = await axios.post("/api/soal/buat/updatesoal", {
            namasoal: NamaSoal,
            level: Level,
            tags: JSON.stringify(TagsDitambahin),
            soal: Soal,
            infokode: JSON.stringify(InfoKode),
            idsoal: data?.id,
            publicsoal: Public
        }).then(d => d.data) as { error?: string };

        if (d.error) {
            setNotif({ status: WarnaStatus.kuning, pesan: d.error });
        } else {
            setSudahDiSave(true);
            router.reload();
        }
    }

    const HapusBuatanSoal = async () => {
        const DataHapus = await axios.post("/api/soal/buat/hapussoal", {
            idsoal: data?.id
        }).then(d => d.data);

        if (DataHapus === "Sukses") router.push("/soal/buat");
    }

    const UlangSoal = () => {
        setInfoKode({
            ...InfoKode,
            [BahasaProgram]: {
                bahasa: BahasaProgram,
                jawabankode: "",
                liatankode: "",
                listjawaban: "",
                contohjawaban: "",
            }
        });
        setSoal("");
        setOutputKonfirmasiJawaban({
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
    }

    useEffect(() => {
        setNotif(!getCookie('notif') ? undefined : JSON.parse(getCookie('notif') as string))
    }, []);

    useEffect(() => {
        const warningText = 'Soal yang kamu bikin belum disimpan - Yakin mau keluar?';
        const handleWindowClose = (e: BeforeUnloadEvent) => {
            if (SudahDiSave) return;
            e.preventDefault();
            return (e.returnValue = warningText);
        };

        window.addEventListener('beforeunload', handleWindowClose);

        // setSudahDiSave(false);

        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [InfoKode, Soal]);

    return (
        <>
            <Navbar profile={profile} />
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
                {Notif &&
                    <div className="mb-2 text-white p-2" style={{ background: `${Notif.status}` }}>{Notif.pesan}</div>
                }
                {KurangData !== "" &&
                    <div className="p-2 fs-6 text-white" style={{ background: "#e35252" }}>
                        {KurangData}
                        <button className="float-end me-2 bg-transparent border-0 text-white" onClick={() => setKurangData("")}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                }
                {mode === "edit" && (data?.pembuat.username !== profile.username || !profile.admin || !profile.moderator) ?
                    <h2 className="text-white text-center">Kamu tidak mempunyai izin untuk mengedit soal ini</h2>
                    :
                    <>
                        <div className="mb-4 fs-6">
                            {mode === "edit" ?
                                <button className="tombol-menu" onClick={UpdateBuatanSoal}><i className="bi bi-download"></i> Update</button>
                                :
                                <button className="tombol-menu" onClick={KirimBuatanSoal}><i className="bi bi-download"></i> Simpan</button>
                            }
                            <button className="tombol-menu" onClick={UlangSoal}><i className="bi bi-arrow-counterclockwise"></i> Ulang</button>
                            {mode === "edit" &&
                                <button className="tombol-menu" onClick={HapusBuatanSoal}><i className="bi bi-trash-fill"></i> Hapus</button>
                            }
                            {mode === "edit" &&
                                <button className={"tombol-menu " + (Public ? "" : "text-white-50")} onClick={() => setPublic(!Public)}>Public: {Public ? "Iya" : "Tidak"}</button>
                            }
                        </div>
                        <div className="row mb-3" style={{ height: "30rem" }}>
                            <div className="col-lg-6">
                                <div className="d-flex flex-row mb-3">
                                    <button className={'me-3 border-0 ' + (StatusSoal === "soal" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusSoal("soal")}><i className="bi bi-fire"></i> Pertanyaan</button>
                                    <button className={"me-3 border-0 " + (StatusSoal === "preview" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusSoal("preview")}><i className="bi bi-patch-exclamation-fill"></i> Output</button>
                                    <button className={"tombol_aktif border-0 " + (StatusSoal === "bantuan" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStatusSoal("bantuan")}><i className="bi bi-question-circle-fill"></i> Bantuan</button>
                                </div>
                                <div style={{ height: "85%" }}>
                                    {StatusSoal === "soal" &&
                                        <div style={{ height: "420px", minHeight: "200px" }}>
                                            <CodeEditor
                                                mode={"markdown"}
                                                value={Soal}
                                                onChange={() => setSoal(SoalKodeEditor!.editor.getValue())}
                                                refData={(ins: ReactAce) => { SoalKodeEditor = ins }}
                                                autoComplete={false}
                                            />
                                        </div>
                                    }
                                    {StatusSoal === "preview" &&
                                        <div className="p-3 text-white" style={{ height: "420px", minHeight: "200px", fontSize: "18px", backgroundColor: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin" }}>
                                            <ReactMarkdown
                                                // eslint-disable-next-line react/no-children-prop
                                                children={Soal}
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
                                            {/* {UbahSoal(Soal)} */}
                                        </div>
                                    }
                                    {StatusSoal === "bantuan" &&
                                        <div className="text-white p-3 fs-5" style={{ height: "100%", backgroundColor: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px" }}>
                                            <h3>Pembuatan Soal</h3>
                                            <p className="fs-5">{`Dalam pembuatan soal, Bisa dibuat dengan bahasa Markdown dan untuk menggunakan Code snippet bisa menggunakan Tag (~~~), Contohnya: `}</p>
                                            <pre className="fs-5 p-3" style={{ background: "rgb(30, 30, 30)", whiteSpace: "pre-wrap", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px" }}>{`~~~javascript
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
                                        <input type="text" id="NamaSoal" className="form-control text-white" placeholder="Soal" defaultValue={data === undefined ? "" : data.namasoal} style={{ height: "calc(2.5rem + 2px)", lineHeight: "3", backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(58, 58, 58)" }} />
                                        <label className="text-white-50" htmlFor="floatingInput" style={{ padding: "0.5rem 0.75rem" }}>Nama soal</label>
                                    </div>
                                    <div className="mb-3">
                                        <select defaultValue={data === undefined ? "0" : data.level.toString()} id="LevelSoal" className="form-control text-white" style={{ backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(58, 58, 58)" }}>
                                            <option value="0" hidden>Level</option>
                                            <option value="1">Level 1</option>
                                            <option value="2">Level 2</option>
                                            <option value="3">Level 3</option>
                                            <option value="4">Level 4</option>
                                            <option value="5">Level 5</option>
                                        </select>
                                    </div>
                                    <div>
                                        <button type="button" className={"me-2 tombol-tags " + (data?.tags.includes("Algortima") ? "tombol-tags-aktif" : "")} onClick={TambahinTags}>Algortima</button>
                                        <button type="button" className={"me-2 tombol-tags " + (data?.tags.includes("Array") ? "tombol-tags-aktif" : "")} onClick={TambahinTags}>Array</button>
                                        <button type="button" className={"me-2 tombol-tags " + (data?.tags.includes("Sorting") ? "tombol-tags-aktif" : "")} onClick={TambahinTags}>Sorting</button>
                                        <button type="button" className={"me-2 tombol-tags " + (data?.tags.includes("Dasar") ? "tombol-tags-aktif" : "")} onClick={TambahinTags}>Dasar</button>
                                        <button type="button" className={"me-2 tombol-tags " + (data?.tags.includes("Matriks") ? "tombol-tags-aktif" : "")} onClick={TambahinTags}>Matriks</button>
                                        <button type="button" className={"me-2 tombol-tags " + (data?.tags.includes("Matematika") ? "tombol-tags-aktif" : "")} onClick={TambahinTags}>Matematika</button>
                                        <button type="button" className={"me-2 tombol-tags " + (data?.tags.includes("Logika") ? "tombol-tags-aktif" : "")} onClick={TambahinTags}>Logika</button>
                                        <button type="button" className={"me-2 tombol-tags " + (data?.tags.includes("RegEx") ? "tombol-tags-aktif" : "")} onClick={TambahinTags}>RegEx</button>
                                        <button type="button" className={"me-2 tombol-tags " + (data?.tags.includes("String") ? "tombol-tags-aktif" : "")} onClick={TambahinTags}>String</button>
                                        <button type="button" className={"me-2 tombol-tags " + (data?.tags.includes("Inggris") ? "tombol-tags-aktif" : "")} onClick={TambahinTags}>Inggris</button>
                                        <button type="button" className={"me-2 tombol-tags " + (data?.tags.includes("Bahasa Indonesia") ? "tombol-tags-aktif" : "")} onClick={TambahinTags}>Bahasa Indonesia</button>
                                    </div>
                                    <p className="text-white-50">Maximum 3 tags</p>
                                </form>
                            </div>
                        </div>
                        <div className="mb-3">
                            <select className="bahasaSelect" onChange={(v) => setBahasaProgram(v.target.value as KumpulanBahasaProgram)}>
                                <option value="python">Python</option>
                                <option value="javascript">Javascript</option>
                                <option value="lua">Lua</option>
                                <option value="ruby">Ruby</option>
                            </select>
                            <button className="btn btn-outline-primary float-end" onClick={() => UbahJawabanKeContoh(confirm('Soal yang kamu tulis akan diubah menjadi soal yang sudah diberikan contoh, Apa kamu yakin ingin mengubahnya?'))}>
                                <i className="bi bi-journal-code"></i>
                                {` Contoh Jawaban`}
                            </button>
                            <button className="btn btn-outline-success float-end me-3" onClick={KonfirmasiJawaban}>
                                <i className="bi bi-check-all"></i>
                                {` Konfirmasi Jawaban`}
                            </button>
                        </div>
                        <div className="row mb-5" style={{ height: "30rem" }}>
                            <div className="col-6">
                                <div className="mb-3">
                                    <button className={'me-3 border-0 ' + (StatusKodeJawaban === "kodejawaban" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStastusKodeJawaban("kodejawaban")}><i className="bi bi-code-square"></i> Kode Jawaban</button>
                                    <button className={'me-3 border-0 ' + (StatusKodeJawaban === "liatkode" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStastusKodeJawaban("liatkode")}><i className="bi bi-bullseye"></i> Liatan kode</button>
                                    <button className={'me-3 border-0 ' + (StatusKodeJawaban === "output" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStastusKodeJawaban("output")}><i className="bi bi-patch-exclamation-fill"></i> Output</button>
                                    <button className={"tombol_aktif border-0 " + (StatusKodeJawaban === "bantuan" ? 'tombolBerikutnya' : 'tombol_aktif bg-transparent')} onClick={() => setStastusKodeJawaban("bantuan")}><i className="bi bi-question-circle-fill"></i> Bantuan</button>
                                </div>
                                <div style={{ height: "85%" }}>
                                    {StatusKodeJawaban === "kodejawaban" &&
                                        <div style={{ height: "420px", minHeight: "200px" }}>
                                            <CodeEditor
                                                mode={BahasaProgram}
                                                value={InfoKode[BahasaProgram] === undefined ? "" : InfoKode[BahasaProgram].jawabankode}
                                                onChange={() => setInfoKode({ ...InfoKode, [BahasaProgram]: { ...InfoKode[BahasaProgram], jawabankode: JawabanKodeEditor!.editor.getValue() } })}
                                                refData={(ins: ReactAce) => { JawabanKodeEditor = ins }}
                                            />

                                        </div>
                                    }
                                    {StatusKodeJawaban === "liatkode" &&
                                        <div style={{ height: "420px", minHeight: "200px" }}>
                                            <CodeEditor
                                                mode={BahasaProgram}
                                                value={InfoKode[BahasaProgram] === undefined ? "" : InfoKode[BahasaProgram].liatankode}
                                                onChange={() => setInfoKode({ ...InfoKode, [BahasaProgram]: { ...InfoKode[BahasaProgram], liatankode: LiatanKodeJawabanEditor!.editor.getValue() } })}
                                                refData={(ins: ReactAce) => { LiatanKodeJawabanEditor = ins }}
                                            />
                                        </div>
                                    }
                                    {StatusKodeJawaban === "output" &&
                                        <div className="mb-3" style={{ height: "420px", background: "rgb(38, 38, 38)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px", whiteSpace: "pre-wrap", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin" }}>
                                            <div className="px-3">
                                                <div className="mt-2">
                                                    {OutputKonfirmasiJawaban.statuskompiler === "Mengirim" &&
                                                        <div className="text-white mt-2">Menigrim kode ke server...</div>
                                                    }
                                                    {OutputKonfirmasiJawaban.statuskompiler === "Sukses" &&
                                                        <>
                                                            {OutputKonfirmasiJawaban.error !== undefined ?
                                                                <div className="px-3 py-2 mt-3 rounded-2 text-white" style={{ background: "rgb(97, 57, 57)", border: "1px solid rgb(145, 78, 78)", letterSpacing: ".7px" }}>
                                                                    <span style={{ whiteSpace: "pre-line" }}>
                                                                        {OutputKonfirmasiJawaban.error}
                                                                    </span>
                                                                </div>
                                                                :
                                                                <>
                                                                    <div className="text-white-50 mb-2">Waktu eksekusi: {OutputKonfirmasiJawaban?.waktu}ms</div>
                                                                    {OutputKonfirmasiJawaban?.data.map((v, i) => {
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
                                                                                                {v.print.map((d, id) => {
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
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {StatusKodeJawaban === "bantuan" &&
                                        <div className="text-white p-3 fs-5" style={{ height: "420px", backgroundColor: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin" }}>
                                            <h3>Kode Jawaban</h3>
                                            <p>Tulis kode solusi jawaban pembuatan soal kamu</p>
                                            <h3>Liatan Kode</h3>
                                            <p>Menunjukkan template kode untuk ke orang yang dikerjakan</p>
                                            <h3>Output</h3>
                                            <p>Output kode saat menekan konfirmasi jawaban</p>
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
                                <div style={{ height: "85%" }}>
                                    {StatusJawaban === "listjawaban" &&
                                        <div style={{ height: "420px" }}>
                                            <CodeEditor
                                                mode={BahasaProgram}
                                                value={InfoKode[BahasaProgram] === undefined ? "" : InfoKode[BahasaProgram].listjawaban}
                                                onChange={() => setInfoKode({ ...InfoKode, [BahasaProgram]: { ...InfoKode[BahasaProgram], listjawaban: JawabanListEditor!.editor.getValue() } })}
                                                refData={(ins: ReactAce) => { JawabanListEditor = ins }}
                                            />
                                        </div>
                                    }
                                    {StatusJawaban === "contohjawaban" &&
                                        <div style={{ height: "420px" }}>
                                            <CodeEditor
                                                mode={BahasaProgram}
                                                value={InfoKode[BahasaProgram] === undefined ? "" : InfoKode[BahasaProgram].contohjawaban}
                                                onChange={() => setInfoKode({ ...InfoKode, [BahasaProgram]: { ...InfoKode[BahasaProgram], contohjawaban: ContohJawabanEditor!.editor.getValue() } })}
                                                refData={(ins: ReactAce) => { ContohJawabanEditor = ins }}
                                            />
                                        </div>
                                    }
                                    {StatusJawaban === "bantuan" &&
                                        <div className="text-white p-3 fs-5" style={{ height: "420px", backgroundColor: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin" }}>
                                            <p>Dalam test case sudah disiapkan function yang namanya &quot;ApakahSama&quot; yang bisa dijalanin dalam server, fungsi ini menerima 3 parameter yaitu:</p>
                                            <p>{`1. "Fungsi" tipe <Function>: Nama fungsi yang dituliskan dalam kode jawaban yang akan dijalanin di dalam server untuk mengetahui kalau jawabannya sama dengan parameter "Hasil"`}</p>
                                            <p>{`2. "Parameter" tipe <List[any]>: "Fungsi" parameter yang ingin diberi dalam kondisi list, Terserah tipe parameternya mau number, string, list, set, enum, dll`}</p>
                                            <p>{`3. "Hasil" tipe <any>: Hasil yang ingin diberikan`}</p>
                                            <h3>List jawaban</h3>
                                            <p>Semua Test yang ingin diuji dan akan disubmit ketika semua test case lulus</p>
                                            <h3>Contoh jawaban</h3>
                                            <p>Sama dengan List jawaban tapi ini hanya ingin di uji coba</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                }
                {/* <footer className="text-white text-center p-2">
                    <ul className="list-unstyled">
                        <li className="d-inline me-3">(C) 2022 Soalkoding</li>
                        <li className="d-inline me-3"><a className="text-decoration-none text-white" href="#">Dashboard</a></li>
                        <li className="d-inline me-3"><a className="text-decoration-none text-white" href="#">Utama</a></li>
                        <li className="d-inline me-3"><a className="text-decoration-none text-white" href="#">Kontak</a></li>
                    </ul>
                </footer> */}
            </div>
        </>
    )
}