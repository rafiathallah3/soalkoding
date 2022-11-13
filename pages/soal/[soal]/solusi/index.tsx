import Navbar from "../../../../components/navbar";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { DataSoal, DataSolusi, Solusi as TipeSolusi } from "../../../../types/tipe";
import { useState } from "react";
import { useRouter } from "next/router";
import { UpdateInfoAkun } from "../../../../services/Servis";
import { Akun } from "@prisma/client";
import FavoritKomponen from "../../../../components/Favorit";
import Modal from 'react-modal';
import { CSSProperties } from "react";
import styles from '../../../../styles/IndexSolusi.module.css'

const StyleModalKonten: CSSProperties = {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "rgb(50, 50, 50)",
    border: "1px solid rgb(50, 50, 50)"
}

const StyleModalOverlay: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(40, 40, 40, 0.25)',
}

export async function getServerSideProps({ params, req, res, query }: { params: { soal: string }, req: NextApiRequest, res: NextApiResponse, query: { lihat: string, berdasarkan: string } }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { redirect: string };
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    try {
        const data = await axios.post(`${process.env.NAMAWEBSITE}/api/soal/solusi/dapatinSolusi`, {
            idsoal: params.soal,
            ...query
        }, {
            headers: { cookie: req.headers.cookie } as any
        }).then(d => d.data);

        return {
            props: {
                data,
                profile: { username: DapatinUser.username, gambar: DapatinUser.gambarurl },
                ...query
            }
        }
    } catch {
        return {
            notFound: true
        }
    }
}

Modal.setAppElement("#__next")
export default function Solusi({ data, lihat, berdasarkan, profile }: { data: DataSolusi, lihat: "semua" | "sendiri" | undefined, berdasarkan: "kepintaran" | "baru" | "lama" | undefined, profile: { username: string, gambar: string } }) {
    const [Solusi, setSolusi] = useState<TipeSolusi[]>(data.solusi);
    const [TunjukkinModal, setTunjukkinModal] = useState(false);
    const [IdSolusiHapus, setIdSolusiHapus] = useState<string>();

    const router = useRouter();

    const KlikKepintaran = async (elementTombol: MouseEvent, idsolusi: string) => {
        const _data = await axios.post("/api/soal/solusi/pintar", {
            idsoal: data.idsoal,
            idsolusi,
        }).then(d => d.data);

        if (_data.suka_ngk) {
            (elementTombol.target as any).style.borderColor = 'white';
            (elementTombol.target as any).style.color = 'white';
        } else {
            (elementTombol.target as any).style.borderColor = 'rgb(150, 150, 150)';
            (elementTombol.target as any).style.color = 'rgb(170, 170, 170)';
        }
        document.getElementById(_data.idsolusi)!.innerText = _data.berapa;
    }

    const GantiQuery = async (e: any) => {
        // (document.getElementById("test")! as HTMLFormElement).submit();
        const Lihat = document.querySelector('input[name="lihat"]:checked') as HTMLInputElement;
        const Berdasarkan = document.querySelector('input[name="berdasarkan"]:checked') as HTMLInputElement;

        router.push({ pathname: `/soal/${data.idsoal}/solusi`, query: { lihat: Lihat?.value, berdasarkan: Berdasarkan?.value } }, undefined, { shallow: true })

        const DataSolusi = await axios.post(`/api/soal/solusi/dapatinSolusi`, {
            idsoal: data.idsoal,
            lihat: Lihat?.value,
            berdasarkan: Berdasarkan?.value
        }).then(d => d.data);

        setSolusi(DataSolusi.solusi);
    }

    const SoalBerikutnya = async () => {
        const RandomSoal = await axios.post("/api/soal/dapatinRandomSoal", {}).then(d => d.data.data) as DataSoal;
        router.push(`/soal/${RandomSoal.id}/latihan`);
    }

    const HapusSolusi = async (id: string) => {
        await axios.post("/api/soal/solusi/hapusSolusi", {
            idsolusi: id
        });

        router.reload();
    }

    return (
        <>
            <Navbar profile={profile} />
            <div className="px-3">
                <div className="p-3 text-white rounded-1 mb-2" style={{ background: "rgb(48, 48, 48)" }}>
                    <div className="row">
                        <div className="col">
                            <div className="mb-2">
                                <a href={`/soal/${data.idsoal}/latihan`} className="me-3 text-white text-decoration-none">{data.soal.namasoal}</a>
                                <span className={"p-2 fs-6 me-2 " + (data.soal.level <= 2 ? "text-white" : data.soal.level <= 4 ? "text-warning" : "text-danger")} style={{ background: "rgb(55, 55, 55)" }}>Level {data.soal.level}</span>
                                {data.ApakahSudahSelesai &&
                                    <i className="bi bi-check-lg"></i>
                                }
                            </div>
                            <div className="mb-1">
                                <span className="me-3">
                                    <i className="bi bi-person-fill me-2"></i>
                                    <a className="text-decoration-none text-white" href={`/profile/` + data.soal.pembuat.username}>{data.soal.pembuat.username}</a>
                                </span>
                                <FavoritKomponen data={{ suka_ngk: data.suka_ngk, berapa: data.soal.favorit.length, idsoal: data.idsoal }} />
                                <span title="Jumlah solusi">
                                    <i className="bi bi-calendar-check me-1"></i>
                                    {data.JumlahSolusi}
                                </span>
                            </div>
                        </div>
                        <div className="col">
                            <div className="d-flex flex-row justify-content-end h-100">
                                <a href={`/soal/${data.idsoal}/latihan`} className={`text-decoration-none align-self-center ${styles["tombol-kerjakan"]} me-2`}>Kerjakan</a>
                                <button className={`align-self-center ${styles["tombol-soalberikutnya"]}`} onClick={SoalBerikutnya}>Soal berikutnya <i className="bi bi-caret-right-fill"></i></button>
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
                <div className="p-1 rounded-1 text-white mb-2">
                    <button className={`${styles['tombol-lainnya']} ${styles['tombol-lainnya-aktif']}`}>Solusi</button>
                    <button className={styles['tombol-lainnya']} onClick={() => router.push(`/soal/${data.idsoal}/diskusi`)}>Diskusi</button>
                </div>
                {data.ApakahSudahSelesai ?
                    <div className="row">
                        <div className="col-10">
                            {Solusi.map((v, i) => {
                                return (
                                    <div key={i} className="p-3 mb-3 rounded-2" style={{ background: "rgb(48, 48, 48)" }}>
                                        <div className="d-flex">
                                            <div className="text-white flex-grow-1">
                                                <i className="bi bi-person me-1"></i>
                                                <a href={`/profile/${v.user.username}`} className="me-3 text-white text-decoration-none">{v.user.username}</a>
                                            </div>
                                            <div className="text-white-50">
                                                {new Date(v.kapan).getDate() + '/' + (new Date(v.kapan).getMonth() + 1) + '/' + new Date(v.kapan).getFullYear()}
                                            </div>
                                        </div>
                                        <div className="px-2 mb-3">
                                            <SyntaxHighlighter customStyle={{ maxHeight: "200px" }} language={v.bahasa} style={tomorrow as any}>{v.kode}</SyntaxHighlighter>
                                        </div>
                                        <div>
                                            <button className={`${styles["tombol-keren"]} me-3`} style={{ "borderColor": (v.apakahSudahPintar ? 'white' : 'rgb(150, 150, 150)'), "color": (v.apakahSudahPintar ? 'white' : 'rgb(170, 170, 170)') }} onClick={(e) => KlikKepintaran(e as any, v.id)}>
                                                <i className="bi bi-arrow-up-short"></i>
                                                Pintar
                                                <span className={"ms-2"} id={v.id}>{JSON.parse(v.pintar).length}</span>
                                            </button>
                                            <a href={`/soal/${v.idsoal}/solusi/${v.id}`} className="border-0 text-decoration-none me-3" style={{ background: 'transparent', color: 'rgb(160, 160, 160)' }}>
                                                <i className="bi bi-chat-right-fill me-2 fs-5"></i>
                                                {v.komentar.length}
                                            </a>
                                            {v.user.username === profile.username &&
                                                <a className="fs-5 text-decoration-none float-end hapus-solusi" onClick={() => { setIdSolusiHapus(v.id); setTunjukkinModal(true) }} style={{ color: "#f20a13" }}>Hapus</a>
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="col">
                            <div className={`p-2 rounded-1 ${styles["filter-jawaban"]}`}>
                                <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Lihat</div>
                                <form id="test" onChange={GantiQuery}>
                                    <fieldset className="mb-2" name="lihat">
                                        <label className={styles['radio-container']}>
                                            <input type="radio" name="lihat" value="semua" defaultChecked={lihat === "semua"} />
                                            <span style={{ marginLeft: "20px" }}>Semua</span>
                                            <span className={styles.checkmark}></span>
                                        </label>
                                        <label className={styles['radio-container']}>
                                            <input type="radio" name="lihat" value="sendiri" defaultChecked={lihat === "sendiri"} />
                                            <span style={{ marginLeft: "20px" }}>Sendiri</span>
                                            <span className={styles.checkmark}></span>
                                        </label>
                                    </fieldset>
                                    <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Berdasarkan</div>
                                    <fieldset name="berdasarkan">
                                        <label className={styles['radio-container']}>
                                            <input type="radio" name="berdasarkan" id="berdasarkan" value="kepintaran" defaultChecked={berdasarkan === "kepintaran"} />
                                            <span style={{ marginLeft: "20px" }}>Kepintaran</span>
                                            <span className={styles.checkmark}></span>
                                        </label>
                                        <label className={styles['radio-container']}>
                                            <input type="radio" name="berdasarkan" id="berdasarkan" value="baru" defaultChecked={berdasarkan === "baru"} />
                                            <span style={{ marginLeft: "20px" }}>Baru</span>
                                            <span className={styles.checkmark}></span>
                                        </label>
                                        <label className={styles['radio-container']}>
                                            <input type="radio" name="berdasarkan" id="berdasarkan" value="lama" defaultChecked={berdasarkan === "lama"} />
                                            <span style={{ marginLeft: "20px" }}>Lama</span>
                                            <span className={styles.checkmark}></span>
                                        </label>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="text-white text-center fs-5">
                        Kamu belum mengerjakan soal ini!
                        <div>
                            Kerjakan soalnya dulu baru kamu bisa melihat semua jawaban orang lain
                        </div>
                    </div>
                }
            </div>
            <Modal
                isOpen={TunjukkinModal}
                onRequestClose={() => setTunjukkinModal(false)}
                style={{ content: StyleModalKonten, overlay: StyleModalOverlay }}
            >
                <div className="fs-5 text-white mb-2">Hapus solusi</div>
                <p className="fs-6" style={{ color: "rgb(200, 200, 200)" }}>Kamu yakin ingin menghapus solusi yang kamu sudah kerjakan??</p>
                <div className="float-end">
                    <button className="me-4" onClick={() => setTunjukkinModal(false)} style={{ background: "transparent", border: "0px solid", color: "#1392bd" }}>Tidak</button>
                    <button className="me-3" onClick={() => { setTunjukkinModal(false); HapusSolusi(IdSolusiHapus!) }} style={{ background: "transparent", border: "0px solid", color: "#1392bd" }}>Iya</button>
                </div>
            </Modal>
        </>
    )
}