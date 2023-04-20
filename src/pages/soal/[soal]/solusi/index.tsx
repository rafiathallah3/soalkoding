import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { DataSoal, IAkun, ISoal, ISolusi } from '../../../../../types/tipe';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../../../../components/navbar';
import FavoritKomponen from '../../../../../components/Favorit';
import styles from '../../../../styles/IndexSolusi.module.css'
import Modal from 'react-modal';
import { CSSProperties } from "react";
import { ApakahSudahMasuk } from '../../../../../lib/Servis';
import { NextApiRequest, NextApiResponse } from 'next';
import { DataModel } from '../../../../../lib/Model';

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

export async function getServerSideProps({ params, req, res, query }: { params: { soal: string }, req: NextApiRequest, res: NextApiResponse, query: any }) {
    const session = await ApakahSudahMasuk(req, res);
    if(!session.props) return session;

    const DataSoal = await DataModel.SoalModel.findById(params.soal)
        .populate("pembuat")
        .populate({ path: "solusi", populate: { path: "user" } })
        .populate({ path: "favorit", populate: { path: "user", select: "_id" } }) as ISoal || null;
    if(DataSoal === null) return { notFound: true };

    return {
        props: {
            data: {
                soal: JSON.parse(JSON.stringify(DataSoal)),
                ApakahSudahSelesai: DataSoal.solusi.find((v) => v.user._id.toString() === session.props.Akun.id) !== undefined,
                suka_ngk: DataSoal.favorit.find((v) => v.user._id.toString() === session.props.Akun.id) !== undefined,
            },
            Akun: session.props.Akun,
            lihat: "semua",
            berdasarkan: "baru",
            bahasa: "semua",
            ...query
        }
    }
}

Modal.setAppElement("#__next");
export default function Solusi({ data, lihat, berdasarkan, bahasa, Akun }: { data: DataSoal, lihat: "semua" | "sendiri" | undefined, berdasarkan: "kepintaran" | "baru" | "lama" | undefined, bahasa: string, Akun: IAkun & { id: string } }) {
    const [Solusi, setSolusi] = useState<(ISolusi)[]>(data.soal.solusi.slice(undefined, 10) as any);
    const [BerapaSolusi, setBerapaSolusi] = useState(10);
    const [LoadingSolusi, setLoadingSolusi] = useState(false);
    const [ApakahMasiAda, setApakahMasiAda] = useState(true);
    const [TunjukkinModal, setTunjukkinModal] = useState(false);
    const [IdSolusiHapus, setIdSolusiHapus] = useState<string>();

    const router = useRouter();

    const KlikKepintaran = async (elementTombol: MouseEvent, idsolusi: string) => {
        const _data = await axios.post("/api/soal/solusi/pintar", {
            idsoal: data.soal._id,
            idsolusi,
        }).then(d => d.data);

        if (_data.suka_ngk) {
            (elementTombol.target as any).style.borderColor = 'white';
            (elementTombol.target as any).style.color = 'white';
        } else {
            (elementTombol.target as any).style.borderColor = 'rgb(150, 150, 150)';
            (elementTombol.target as any).style.color = 'rgb(170, 170, 170)';
        }
        document.getElementById(idsolusi)!.innerText = _data.berapa;
    }

    const GantiQuery = async (e: any) => {
        const Lihat = document.querySelector('input[name="lihat"]:checked') as HTMLInputElement;
        const Berdasarkan = document.querySelector('input[name="berdasarkan"]:checked') as HTMLInputElement;
        const Bahasa = document.querySelector('input[name="bahasa"]:checked') as HTMLInputElement;

        router.push({ pathname: `/soal/${data.soal._id}/solusi`, query: { lihat: Lihat?.value, berdasarkan: Berdasarkan?.value, bahasa: Bahasa?.value } }, undefined, { shallow: true })

        setLoadingSolusi(true);

        const DataSolusi = await axios.post(`/api/soal/solusi/dapatinSolusi`, {
            idsoal: data.soal._id,
            lihat: Lihat?.value,
            berdasarkan: Berdasarkan?.value,
            bahasa: Bahasa?.value
        }).then(d => d.data);

        setLoadingSolusi(false);
        setSolusi(DataSolusi.solusi);
    }

    const SolusiLainnya = () => {
        setSolusi(data.soal.solusi.slice(undefined, BerapaSolusi + 10) as any);
        setBerapaSolusi(BerapaSolusi + 10);

        setApakahMasiAda(!(Solusi.length >= data.soal.solusi.length));
    }

    const SoalBerikutnya = async () => {
        const RandomSoal = await axios.post("/api/soal/dapatinRandomSoal", {}).then(d => d.data.data) as ISoal;
        if(RandomSoal) {
            router.push(`/soal/${RandomSoal._id}/latihan`);
        }
    }

    const HapusSolusi = async (id: string) => {
        await axios.post("/api/soal/solusi/hapusSolusi", {
            idsolusi: id
        });

        router.reload();
    }

    return (
        <>
            <Head>
                <title>Solusi</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar profile={Akun} />
            <div className="px-3">
                <div className="p-3 text-white rounded-1 mb-2" style={{ background: "rgb(48, 48, 48)" }}>
                    <div className="row">
                        <div className="col">
                            <div className="mb-2">
                                <a href={`/soal/${data.soal._id}/latihan`} className="me-3 text-white text-decoration-none">{data.soal.namasoal}</a>
                                <span className={"p-2 fs-6 me-2 " + (data.soal.level <= 2 ? "text-white" : data.soal.level <= 4 ? "text-warning" : "text-danger")} style={{ background: "rgb(55, 55, 55)" }}>Level {data.soal.level}</span>
                                {data.ApakahSudahSelesai &&
                                    <i className="bi bi-check-lg"></i>
                                }
                            </div>
                            <div className="mb-1">
                                <span className="me-3">
                                    <i className="bi bi-person-fill me-2"></i>
                                    <a className={`me-3 text-decoration-none ${data.soal.pembuat.admin ? styles['text-admin'] : data.soal.pembuat.moderator ? styles['text-moderator'] : 'text-white'}`} href={`/profile/` + data.soal.pembuat.username}>{data.soal.pembuat.username}</a>
                                </span>
                                <FavoritKomponen data={{ suka_ngk: data.suka_ngk, berapa: data.soal.favorit.length, idsoal: data.soal._id }} />
                                <span title="Jumlah solusi">
                                    <i className="bi bi-calendar-check me-1"></i>
                                    {data.soal.solusi.length}
                                </span>
                            </div>
                        </div>
                        <div className="col">
                            <div className="d-flex flex-row justify-content-end h-100">
                                {data.soal.pembuat._id === Akun.id &&
                                    <a href={`/soal/${data.soal._id}/edit`} className={`text-decoration-none align-self-center ${styles["tombol-edit"]} me-2`}>Edit</a>
                                }
                                <a href={`/soal/${data.soal._id}/latihan`} className={`text-decoration-none align-self-center ${styles["tombol-kerjakan"]} me-2`}>Kerjakan</a>
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
                    <button className={styles['tombol-lainnya']} onClick={() => router.push(`/soal/${data.soal._id}/diskusi`)}>Diskusi</button>
                </div>
                {data.ApakahSudahSelesai ?
                    <div className="row">
                        <div className="col-10">
                            <InfiniteScroll
                                pageStart={0}
                                loadMore={SolusiLainnya}
                                hasMore={ApakahMasiAda}
                                loader={<span className="text-white text-center">Loading...</span>}
                                useWindow={false}
                            >
                                {!LoadingSolusi ?
                                    Solusi.map((v, i) => {
                                        return (
                                            <div key={i} className="p-3 mb-3 rounded-2" style={{ background: "rgb(48, 48, 48)" }}>
                                                <div className="d-flex">
                                                    <div className="text-white flex-grow-1">
                                                        <i className="bi bi-person me-1"></i>
                                                        <a href={`/profile/${v.user.username}`} className={`me-2 text-decoration-none ${v.user.admin ? styles['text-admin'] : v.user.moderator ? styles['text-moderator'] : 'text-white'}`}>{v.user.username}</a>
                                                        {v.user.username === data.soal.pembuat.username &&
                                                            <span className="text-white fw-bold">(Pembuat Soal)</span>
                                                        }
                                                    </div>
                                                    <div className="text-white-50">
                                                        {new Date(v.createdAt).getDate() + '/' + (new Date(v.createdAt).getMonth() + 1) + '/' + new Date(v.createdAt).getFullYear()}
                                                    </div>
                                                </div>
                                                <div className="px-2 mb-3">
                                                    <SyntaxHighlighter customStyle={{ maxHeight: "200px" }} language={v.bahasa} style={tomorrow as any}>{v.kode}</SyntaxHighlighter>
                                                </div>
                                                <div>
                                                    <button className={`${styles["tombol-keren"]} me-3`} style={{ "borderColor": (v.pintar.includes(Akun.id) ? 'white' : 'rgb(150, 150, 150)'), "color": (v.pintar.includes(Akun.id) ? 'white' : 'rgb(170, 170, 170)') }} onClick={(e) => KlikKepintaran(e as any, v._id)}>
                                                        <i className="bi bi-arrow-up-short"></i>
                                                        Pintar
                                                        <span className={"ms-2"} id={v._id}>{v.pintar.length}</span>
                                                    </button>
                                                    <a href={`/soal/${data.soal._id}/solusi/${v._id}`} className="border-0 text-decoration-none me-3" style={{ background: 'transparent', color: 'rgb(160, 160, 160)' }}>
                                                        <i className="bi bi-chat-right-fill me-2 fs-5"></i>
                                                        {v.diskusi.length}
                                                    </a>
                                                    {((v.user.username === Akun.username || Akun.moderator || Akun.admin) && v.user.username !== data.soal.pembuat.username) &&
                                                        <a className="fs-5 text-decoration-none float-end" role={"button"} onClick={() => { setIdSolusiHapus(v._id); setTunjukkinModal(true) }} style={{ color: "#f20a13" }}>Hapus</a>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                :
                                <div className='text-center'>
                                    <div className="spinner-border text-light mx-auto" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                }
                            </InfiniteScroll>
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
                                    <fieldset className="mb-2" name="berdasarkan">
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
                                    <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Bahasa</div>
                                    <fieldset name="bahasa">
                                        <label key={0} className={styles['radio-container']}>
                                            <input type="radio" name="bahasa" id="bahasa" value={"semua"} defaultChecked={bahasa === "semua"} />
                                            <span style={{ marginLeft: "20px" }}>{"Semua"}</span>
                                            <span className={styles.checkmark}></span>
                                        </label>
                                        {data.soal.BahasaSoal.map((v, i) => {
                                            return (
                                                <label key={i+1} className={styles['radio-container']}>
                                                    <input type="radio" name="bahasa" id="bahasa" value={v.bahasa} defaultChecked={bahasa === v.bahasa} />
                                                    <span style={{ marginLeft: "20px" }}>{v.bahasa.at(0)?.toUpperCase() + v.bahasa.slice(1)}</span>
                                                    <span className={styles.checkmark}></span>
                                                </label>
                                            )
                                        })}
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
                <p className="fs-6" style={{ color: "rgb(200, 200, 200)" }}>Kamu yakin ingin menghapus solusi yang kamu sudah kerjakan?</p>
                <div className="float-end">
                    <button className="me-4" onClick={() => setTunjukkinModal(false)} style={{ background: "transparent", border: "0px solid", color: "#1392bd" }}>Tidak</button>
                    <button className="me-3" onClick={() => { setTunjukkinModal(false); HapusSolusi(IdSolusiHapus!) }} style={{ background: "transparent", border: "0px solid", color: "#1392bd" }}>Iya</button>
                </div>
            </Modal>
        </>
    )
}