import axios from "axios";
import dynamic from "next/dynamic";
import { BaseSyntheticEvent, useState } from "react";
import ReactAce from "react-ace/lib/ace";
import Background from "../components/background";
import Navbar from "../components/navbar";
import styles from '../styles/soal.module.css';
const CodeEditor = dynamic(import('../components/codeEditor'), {ssr: false});

export default function Soal() {
    const [IdBahasaProgram, setIdBahasaProgram] = useState('71');
    const [Kode, setKode] = useState(`def Solusi():
    print("Solusi")`);

    let kodeEditor: ReactAce | undefined = undefined;

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
        "71": `def Solusi():
    print("Solusi")`,
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

    const KlikOutput = () => {
        const pertanyaanElement = document.getElementById('tombolpertanyaan')!;
        const outputElement = document.getElementById('tomboloutput')!;

        if(outputElement.classList.contains("tombol_aktif")) {
            pertanyaanElement.classList.remove("tombolBerikutnya");
            pertanyaanElement.classList.add("tombol_aktif");
            pertanyaanElement.classList.add("bg-transparent");

            outputElement.classList.remove("tombol_aktif");
            outputElement.classList.remove("bg-transparent");
            outputElement.classList.add("tombolBerikutnya");
            document.getElementById("output")!.style.display = "block";
            document.getElementById("soal")!.style.display = "none";
        }
    }

    const KlikPertanyaan = () => {
        const pertanyaanElement = document.getElementById('tombolpertanyaan')!;
        const outputElement = document.getElementById('tomboloutput')!;

        if(pertanyaanElement.classList.contains("tombol_aktif")) {
            outputElement.classList.remove("tombolBerikutnya");
            outputElement.classList.add("tombol_aktif");
            outputElement.classList.add("bg-transparent");

            pertanyaanElement.classList.remove("tombol_aktif");
            pertanyaanElement.classList.remove("bg-transparent");
            pertanyaanElement.classList.add("tombolBerikutnya");
            document.getElementById("output")!.style.display = "none";
            document.getElementById("soal")!.style.display = "block";
        }
    }

    const GantiBahasaProgram = (e: BaseSyntheticEvent) => {
        console.log(ListBahasaProgram[e.target.value as keyof typeof ListBahasaProgram])
        setIdBahasaProgram(e.target.value);
        setKode(ListKode[e.target.value as keyof typeof ListKode]);
        console.log(Kode);
    }

    const StatusKirimOutput = () => {
        document.getElementById("hasilKode")!.style.display = "none";
        document.getElementById("KirimStatusKode")!.style.display = "block";
    }

    const KirimTest = async (e: BaseSyntheticEvent) => {
        KlikOutput();
        StatusKirimOutput();

        const hasil = await axios.post("/api/kirimkode", {
            kode: kodeEditor!.editor.getValue(),
            idBahasaProgram: IdBahasaProgram
        });
        console.log("ROblox");
        console.log(hasil);
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
            `}</style>
            <div className="container-fluid">
                <div className="row justify-content-center min-vh-100">
                    <div className="col">
                        <div className="d-flex flex-column h-100 ms-4">
                            <div className="row justify-content-center mb-3" style={{background: "transparent"}}>
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
                            <div className="row justify-content-center">
                                <div className="text-white">
                                    <div style={{height: "50px"}}>
                                        <button id="tombolpertanyaan" className='me-3 tombolBerikutnya border-0' onClick={KlikPertanyaan}>Pertanyaan</button>
                                        <button id="tomboloutput" className="tombol_aktif bg-transparent border-0" onClick={KlikOutput}>Output</button>
                                    </div>
                                </div>
                            </div>
                            <div id="soal" className="justify-content-center mb-2" style={{background: "rgb(48, 48, 48)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px", height: "80%", whiteSpace: "pre-wrap"}}>
                                <div className="text-white px-3">{`
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

Format Masukan dan Keluaran
Masukan diawali dengan sebuah bilangan bulat N yang memenuhi 1 ≤ 𝑁 ≤ 1000. Kemudian
untuk N baris berikutnya, akan terdapat sebuah kata tanpa spasi di tiap baris. Panjang kata tersebut
tidak melebihi 20 karakter. Baris pertama setelah N adalah kata yang disebut Andi, baris setelahnya
merupakan kata yang disebut Budi, dan begitu seterusnya.
Keluaran terdiri dari sebaris kalimat. Keluaran akan berupa “Andi menang” jika poin Andi lebih
banyak dari Budi, “Budi menang” jika poin Budi lebih banyak dari Andi, dan “Gaada yang
menang” jika poin Andi dan Budi berjumlah sama.
                                
                                `}</div>
                            </div>
                            <div id="output" className="justify-content-center mb-2" style={{background: "rgb(38, 38, 38)", border: "1px solid rgb(59, 59, 59)", borderRadius: "5px", height: "80%", whiteSpace: "pre-wrap", display: "none"}}>
                                <div id="hasilKode" style={{display: "none"}}>
                                    <div className="text-white px-3 mt-2">
                                        <span className="me-5">Waktu: 10ms</span>
                                        <span style={{color: "rgb(219, 18, 18)"}}>Error: 1</span>
                                    </div>
                                    <hr className="text-white" />
                                    <div className="text-white px-3">STDERror: </div>
                                </div>
                                <div id="KirimStatusKode" className="text-white px-3 mt-2">Menigrim kode ke server...</div>
                            </div>
                            <div className="row justify-content-center">
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
                            <div className="row justify-content-center mb-3" style={{background: "transparent"}}>
                                <div className="text-white">
                                    <div style={{height: "55px"}}>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center">
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
                            <div className="row justify-content-center mb-2" style={{height: "80%"}}>
                                <div>
                                    <CodeEditor
                                    mode={ListBahasaProgram[IdBahasaProgram as keyof typeof ListBahasaProgram]}
                                    value={Kode}
                                    refData={(ins: ReactAce) => {kodeEditor = ins}}
                                    />
                                </div>
                            </div>
                            <div className="row justify-content-center">
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