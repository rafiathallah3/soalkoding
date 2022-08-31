import axios from "axios";
import dynamic from "next/dynamic";
import { BaseSyntheticEvent, useState } from "react";
import ReactAce from "react-ace/lib/ace";
import Background from "../../components/background";
import Navbar from "../../components/navbar";
import styles from '../../styles/soal.module.css';
const CodeEditor = dynamic(import('../../components/codeEditor'), {ssr: false});

type HasilJawaban = {
    koreksi: "lulus" | "gagal" | "",
    status: "Sukses" | "Error" | "",
    hasil: any,
    jawaban: any
}

export default function Soal() {
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
        "71": `def Solusi(x, y):
    if y == 2:
        return z
    return x * y
    
if __name__ == "__main__":
    def ApakahSama(fungsi, parameter, jawaban):
        try:
            hasil = fungsi(*parameter)
            return {"hasil": str(hasil) if hasil == None else hasil, "jawaban": jawaban, "status": "Sukses"}
        except Exception as e:
            import base64
            return {"hasil": base64.b64encode(str(e).encode('utf-8')).decode('utf-8'), "jawaban": jawaban, "status": "Error"}
    
    print(ApakahSama(Solusi, (5, 6), 30))
    print(ApakahSama(Solusi, (3, 10), 30))
    print(ApakahSama(Solusi, (5, 2), 30))`,
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

    const [IdBahasaProgram, setIdBahasaProgram] = useState('71');
    const [Output, setOutput] = useState<{error: string, waktu: string, output: HasilJawaban[], status: "Mengirim" | "Error" | "Sukses" | "", lulus: number, gagal: number}>({
        error: "",
        waktu: "",
        status: "",
        lulus: 0,
        gagal: 0,
        output: [{
            status: "",
            koreksi: "",
            hasil: "",
            jawaban: ""
        }],
    });
    const [StatusTekananSoalOutput, setStatusTekananSoalOutput] = useState('soal');
    const [Kode, setKode] = useState(ListKode['71']);

    let kodeEditor: ReactAce | undefined = undefined;

    const KlikOutput = () => {
        setStatusTekananSoalOutput('output');
        const pertanyaanElement = document.getElementById('tombolpertanyaan')!;
        const outputElement = document.getElementById('tomboloutput')!;

        if(outputElement.classList.contains("tombol_aktif")) {
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

        if(pertanyaanElement.classList.contains("tombol_aktif")) {
            outputElement.classList.remove("tombolBerikutnya");
            outputElement.classList.add("tombol_aktif");
            outputElement.classList.add("bg-transparent");

            pertanyaanElement.classList.remove("tombol_aktif");
            pertanyaanElement.classList.remove("bg-transparent");
            pertanyaanElement.classList.add("tombolBerikutnya");
        }
    }

    const GantiBahasaProgram = (e: BaseSyntheticEvent) => {
        console.log(ListBahasaProgram[e.target.value as keyof typeof ListBahasaProgram])
        setIdBahasaProgram(e.target.value);
        setKode(ListKode[e.target.value as keyof typeof ListKode]);
        console.log(Kode);
    }

    const StatusKirimOutput = () => {
        setStatusTekananSoalOutput('output');
        setOutput({...Output, status: "Mengirim"});
    }

    const KirimTest = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        KlikOutput();
        StatusKirimOutput();

        const hasil: {status: string, output: HasilJawaban[] | undefined, error: string | undefined, waktu: string, lulus: number, gagal: number} = await axios.post("/api/kirimkode", {
            kode: kodeEditor!.editor.getValue(),
            idBahasaProgram: IdBahasaProgram
        }).then(d => d.data);
        console.log(hasil);
        
        switch (hasil.status) {
            case "Error":
                setOutput({
                    ...Output,
                    status: hasil.status,
                    error: hasil.error!,
                    waktu: (parseFloat(hasil.waktu) * 1000).toString() + 'ms',
                });
                break;
            case "Sukses":
                setOutput({
                    ...Output,
                    status: hasil.status,
                    output: hasil.output!,
                    waktu: (parseFloat(hasil.waktu) * 1000).toString() + 'ms',
                    lulus: hasil.lulus,
                    gagal: hasil.gagal
                });
                break;
        }
    }

    return (
        <Background>
            <Navbar />
            <style>{`
            body {
                overflow: hidden
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

            .scrollbar-primary::-webkit-scrollbar-thumb {
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
                background-color: #4285F4;
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
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <div className="col">
                        <div className="d-flex flex-column h-100 ms-4">
                            <div className="row mb-3" style={{background: "transparent"}}>
                                <div className="text-white">
                                    <div style={{height: "55px"}}>
                                        <h5>Starlight Anya</h5>
                                        <div>
                                            <span className="text-warning me-4">Medium</span>
                                            <span className="me-4">
                                                <i className="bi bi-star-fill me-1"></i>
                                                300
                                            </span>
                                            <span>
                                                <i className="bi bi-person-fill me-2"></i>
                                                <a className="text-decoration-none text-white" href="#">Rafi Athallah</a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="text-white">
                                    <div style={{height: "50px"}}>
                                        <button id="tombolpertanyaan" className='me-3 tombolBerikutnya border-0' onClick={KlikPertanyaan}>Pertanyaan</button>
                                        <button id="tomboloutput" className="tombol_aktif bg-transparent border-0" onClick={KlikOutput}>Output</button>
                                    </div>
                                </div>
                            </div>
                            {StatusTekananSoalOutput === 'soal' ?
                            <div id="soal" className="mb-2" style={{background: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px",whiteSpace: "pre-wrap"}}>
                                <div className="px-3 text-white" style={{overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin", height: "64.1rem"}}>
                                    {`
<h1>Deskripsi Masalah</h1>
Andi dan Budi merupakan teman yang suka main bersama. Suatu hari, mereka mempelajari
tentang palindrom di sekolah. Palindrom adalah suatu kata yang serupa baik jika dibaca dari awal
maupun dari akhir. Contoh palindrom adalah “katak”. Mereka pun memutuskan untuk bermain
dengan palindrom ini.

Andi dan Budi akan bergantian menyebutkan sebuah kata, dengan Andi mendapat giliran lebih
dulu. Jika kata yang disebutkan adalah palindrom, maka orang tersebut akan mendapat 1 poin.
Jumlah poin ini akan dijumlahkan. Pada akhir permainan, orang yang mempunyai poin lebih
banyak adalah pemenangnya. Bantulah Andi dan Budi menentukan pemenang dari permainan
mereka!
                                    `}
                                </div>
                            </div>
                            :
                            <div id="output" className="mb-2" style={{background: "rgb(38, 38, 38)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px", whiteSpace: "pre-wrap", height: "64.1rem"}}>
                                {(Output.status !== "" && Output.status !== "Mengirim") &&
                                <div>
                                    <div className="text-white px-3 mt-2">
                                        <span className="me-3">Waktu: {Output.waktu}</span>
                                        <span className="me-3 text-success">Lulus: {Output.lulus}</span>
                                        <span className="me-3 text-danger">Gagal: {Output.gagal}</span>
                                    </div>
                                    <hr className="text-white" style={{marginBottom: "0px"}} />
                                </div>
                                }
                                <div className="px-3" style={{overflowX: "hidden", overflowY: "auto", scrollbarWidth: "thin"}}>
                                    {Output.status !== "Mengirim" &&
                                    <div className="mt-2">
                                        {Output.status === "Error" &&
                                        <div className="px-3 text-white">
                                            <div className="mb-3">Output Error:</div>
                                            <div className="px-3 py-2 rounded-2" style={{background: "rgb(97, 57, 57)", border: "1px solid rgb(145, 78, 78)", letterSpacing: ".7px"}}> 
                                                {Output.error}
                                            </div>
                                        </div>
                                        }
                                        {Output.status === "Sukses" &&
                                        (Output.output.map((v, i) => {
                                            if(v.koreksi === "lulus") {
                                                return (
                                                <details className="mb-3 panah text-success">
                                                    <summary className="mb-2">Test #{i+1}: Success</summary>
                                                    <div className="px-3 py-2 rounded-2 text-white" style={{background: "rgb(35, 102, 53)", border: "1px solid rgb(51, 130, 72)", letterSpacing: ".7px"}}> 
                                                        Output: {v.hasil}, Jawaban: {v.jawaban}
                                                    </div>
                                                </details>
                                                )
                                            } else if(v.koreksi === "gagal") {
                                                return (
                                                <details className="mb-2 panah text-danger">
                                                    <summary className="mb-2">Test #{i+1}: Gagal</summary>
                                                    <div className="px-3 py-2 rounded-2 text-white" style={{background: "rgb(97, 57, 57)", border: "1px solid rgb(145, 78, 78)", letterSpacing: ".7px"}}> 
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
                                    <div style={{height: "50px"}}>
                                        <button className="text-white tombolBerikutnya">
                                            <i className="bi bi-skip-forward-fill me-2"></i>
                                            Berikutnya
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-7">
                        <div className="d-flex flex-column h-100 ms-4">
                            <div className="row mb-3" style={{background: "transparent"}}>
                                <div className="text-white">
                                    <div style={{height: "55px"}}>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="text-white">
                                    <div style={{height: "50px"}}>
                                        <select onChange={GantiBahasaProgram} className={styles.bahasaSelect}>
                                            <option value="71">Python</option>
                                            <option value="63">Javascript</option>
                                            <option value="74">Typescript</option>
                                            <option value="54">C++</option>
                                            <option value="64">Lua</option>
                                            <option value="73">Rust</option>
                                            <option value="72">Ruby</option>
                                        </select>
                                        <button className="tombolBerikutnya" style={{float: "right"}}>Settings</button>
                                        <button className="tombolBerikutnya me-3" style={{float: "right"}}>Reset</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2" style={{height: "80%"}}>
                                <div>
                                    <CodeEditor
                                    mode={ListBahasaProgram[IdBahasaProgram as keyof typeof ListBahasaProgram]}
                                    value={Kode}
                                    onChange={() => setKode(kodeEditor!.editor.getValue())}
                                    refData={(ins: ReactAce) => {kodeEditor = ins}}
                                    autoComplete={true}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="text-white">
                                    <div style={{height: "50px"}}>
                                        <button className="text-white tombolBerikutnya">
                                            <i className="bi bi-skip-forward-fill me-2"></i>
                                            Import
                                        </button>
                                        <button className="text-white tombolBerikutnya" style={{float: "right"}}>
                                            <i className="bi bi-skip-forward-fill me-2"></i>
                                            Kirim
                                        </button>
                                        <button className="text-white tombolBerikutnya me-4" style={{float: "right"}} onClick={KirimTest}>
                                            <i className="bi bi-skip-forward-fill me-2"></i>
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