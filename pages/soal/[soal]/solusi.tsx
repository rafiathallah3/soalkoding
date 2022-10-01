import Navbar from "../../../components/navbar";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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

export default function Solusi() {
    return (
        <div className="px-3">
            <Navbar />
            <style>{`
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
            
            <div className="p-3 text-white rounded-1 mb-2" style={{background: "rgb(48, 48, 48)"}}>
                <div className="row">
                    <div className="col">
                        <div className="mb-2">
                            <span className="me-3">Starlight anya</span>
                            <span className="p-2 fs-6 me-2" style={{background: "rgb(55, 55, 55)"}}>Level 1</span>
                            <i className="bi bi-check-lg"></i>
                        </div>
                        <div className="mb-1">
                            <span className="me-3">
                                <i className="bi bi-person-fill me-2"></i>
                                <a className="text-decoration-none text-white" href="#">Rafi</a>
                            </span>
                            <span className="me-4 favorit">
                                <i className="bi bi-star me-1"></i>
                                0
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
            <div className="p-3 rounded-1 text-white mb-2" style={{background: 'rgb(60, 60, 60)'}}>
                <span className="me-3">Seberapa puasnya kamu dengan soal ini?</span>
                <button className="me-2 tombol-puas">Tidak puas</button>
                <button className="me-2 tombol-puas">Biasa</button>
                <button className="me-2 tombol-puas">Sangat puas</button>
            </div>
            <div className="row">
                <div className="col-10">
                    {Array.from(Array(10).keys()).map((v) => {
                        return (
                            <div key={v} className="p-3 mb-3" style={{background: "rgb(48, 48, 48)"}}>
                                <div className="text-white">
                                    <i className="bi bi-person me-1"></i>
                                    Raihan
                                </div>
                                <div className="px-2 mb-3">
                                    <SyntaxHighlighter customStyle={{maxHeight: "150px"}} language="javascript" style={tomorrow as any}>{TemplateKoding}</SyntaxHighlighter>
                                </div>
                                <div>
                                    <button className="tombol-keren me-3">
                                        <i className="bi bi-arrow-up-short"></i>
                                        Keren
                                        <span className="ms-1">123</span>
                                    </button>
                                    <button className="tombol-keren me-3">
                                        <i className="bi bi-arrow-up-short"></i>
                                        Pintar
                                        <span className="ms-1">123</span>
                                    </button>
                                    <button className="border-0" style={{background: 'transparent', color: 'rgb(160, 160, 160)'}}>
                                        <i className="bi bi-chat-right-fill me-2 fs-5"></i>
                                        20
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    
                </div>
                <div className="col">
                    <div className="p-2 rounded-1 filter-jawaban">
                        <div className="mb-2 fw-bold" style={{color: "rgb(220, 220, 220)", fontSize: "17px"}}>Lihat</div>
                        <fieldset className="mb-2" id="lihat">
                            <label className="radio-container">
                                <input type="radio" name="lihat" value="semua" />
                                <span style={{marginLeft: "20px"}}>Semua</span>
                                <span className="checkmark"></span>
                            </label>
                            <label className="radio-container">
                                <input type="radio" name="lihat" value="sendiri" />
                                <span style={{marginLeft: "20px"}}>Sendiri</span>
                                <span className="checkmark"></span>
                            </label>
                        </fieldset>
                        <div className="mb-2 fw-bold" style={{color: "rgb(220, 220, 220)", fontSize: "17px"}}>Berdasarkan</div>
                        <fieldset id="berdasarkan">
                            <label className="radio-container">
                                <input type="radio" name="berdasarkan" value="kekerenan" />
                                <span style={{marginLeft: "20px"}}>Kekerenan</span>
                                <span className="checkmark"></span>
                            </label>
                            <label className="radio-container">
                                <input type="radio" name="berdasarkan" value="kepintaran" />
                                <span style={{marginLeft: "20px"}}>Kepintaran</span>
                                <span className="checkmark"></span>
                            </label>
                            <label className="radio-container">
                                <input type="radio" name="berdasarkan" value="baru" />
                                <span style={{marginLeft: "20px"}}>Baru</span>
                                <span className="checkmark"></span>
                            </label>
                            <label className="radio-container">
                                <input type="radio" name="berdasarkan" value="lama" />
                                <span style={{marginLeft: "20px"}}>Lama</span>
                                <span className="checkmark"></span>
                            </label>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    )
}