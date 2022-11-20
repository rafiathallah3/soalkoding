import { NextApiRequest, NextApiResponse } from "next";
import { UpdateInfoAkun } from "../../../services/Servis";
import { DataSoal, HasilDapatinUser, TipeProfile } from "../../../types/tipe";
import { useRouter } from "next/router";
import { CSSProperties, useState } from "react";
import styles from '../../../styles/IndexSolusi.module.css'
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios";
import ReactAce from "react-ace/lib/ace";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Modal from 'react-modal';
import FavoritKomponen from "../../../components/Favorit";
import Navbar from "../../../components/navbar";
import Head from "next/head";

const CodeEditor = dynamic(import('../../../components/codeEditor'), { ssr: false });

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

export async function getServerSideProps({ params, req, res }: { params: { soal: string }, req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as HasilDapatinUser;
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    try {
        const data = await axios.post(`${process.env.NAMAWEBSITE}/api/soal/dapatinSoal`, {
            idsoal: params.soal,
        }, {
            headers: { cookie: req.headers.cookie } as any
        }).then(d => d.data);

        return {
            props: {
                data,
                profile: DapatinUser.profile,
            }
        }
    } catch {
        return {
            notFound: true
        }
    }
}

Modal.setAppElement("#__next")
export default function Diksusi({ data, profile }: { data: DataSoal, profile: TipeProfile }) {
    const [Text, setText] = useState('');
    const [StatusText, setStatusText] = useState<"Tulisan" | "Output">("Tulisan");
    const [TunjukkinModal, setTunjukkinModal] = useState(false);
    const [IdDiskusiHapus, setIdDiskusiHapus] = useState<number>();

    let TextKodeEditor: ReactAce | undefined = undefined;

    const router = useRouter();

    const SoalBerikutnya = async () => {
        const RandomSoal = await axios.post("/api/soal/dapatinRandomSoal", {}).then(d => d.data.data) as DataSoal;
        router.push(`/soal/${RandomSoal.id}/latihan`);
    }

    const KirimDiskusi = async () => {
        await axios.post("/api/soal/diskusi", {
            tipe: "buat",
            idsoal: data.id,
            text: Text,
        });

        router.reload();
    }

    const VoteDiskusi = async (element: React.MouseEvent<HTMLElement>, iddiskusi: number, vote: "up" | "down") => {
        const Hasil = await axios.post("/api/soal/diskusi", {
            tipe: "vote",
            iddiskusi,
            idsoal: data.id,
            status: vote,
        }).then((d) => d.data) as { suka: string, berapa: string };

        switch (Hasil.suka) {
            case "up":
                (element.target as HTMLSpanElement).style.color = 'green';
                document.getElementById('down-' + iddiskusi.toString())!.style.color = 'rgb(150, 150, 150)';
                break;
            case "down":
                (element.target as HTMLSpanElement).style.color = 'red';
                document.getElementById('up-' + iddiskusi.toString())!.style.color = 'rgb(150, 150, 150)';
                break;
            case "biasa":
                (element.target as HTMLSpanElement).style.color = 'rgb(150, 150, 150)';
                break;
        }

        document.getElementById('diskusi-' + iddiskusi.toString())!.innerText = Hasil.berapa.toString();
    }

    const HapusDiskusi = async () => {
        await axios.post("/api/soal/diskusi", {
            tipe: "hapus",
            iddiskusi: IdDiskusiHapus,
            idsoal: data.id,
        });

        router.reload();
    }

    return (
        <>
            <Head>
                <title>Diskusi</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar profile={profile} />
            <div className="px-3">
                <div className="p-3 text-white rounded-1 mb-2" style={{ background: "rgb(48, 48, 48)" }}>
                    <div className="row">
                        <div className="col">
                            <div className="mb-2">
                                <a href={`/soal/${data.id}/latihan`} className="me-3 text-white text-decoration-none">{data.namasoal}</a>
                                <span className={"p-2 fs-6 me-2 " + (data.level <= 2 ? "text-white" : data.level <= 4 ? "text-warning" : "text-danger")} style={{ background: "rgb(55, 55, 55)" }}>Level {data.level}</span>
                                {data.ApakahSudahSelesai &&
                                    <i className="bi bi-check-lg"></i>
                                }
                            </div>
                            <div className="mb-1">
                                <span className="me-3">
                                    <i className="bi bi-person-fill me-2"></i>
                                    <a className={`me-3 text-decoration-none ${data.pembuat.admin ? styles['text-admin'] : data.pembuat.moderator ? styles['text-moderator'] : 'text-white'}`} href={`/profile/` + data.pembuat.username}>{data.pembuat.username}</a>
                                </span>
                                <FavoritKomponen data={{ suka_ngk: data.suka_ngk, berapa: data.favorit.length, idsoal: data.id }} />
                                <span title="Jumlah solusi">
                                    <i className="bi bi-calendar-check me-1"></i>
                                    {data.solusi.length}
                                </span>
                            </div>
                        </div>
                        <div className="col">
                            <div className="d-flex flex-row justify-content-end h-100">
                                <a href={`/soal/${data.id}/latihan`} className={`text-decoration-none align-self-center ${styles["tombol-kerjakan"]} me-2`}>Kerjakan</a>
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
                    <button className={styles['tombol-lainnya']} onClick={() => router.push(`/soal/${data.id}/solusi`)}>Solusi</button>
                    <button className={`${styles['tombol-lainnya']} ${styles['tombol-lainnya-aktif']}`}>Diskusi</button>
                </div>
                <div className="p-3 rounded-1" style={{ background: "rgb(48, 48, 48)" }}>
                    <div className="d-flex flex-row mb-3">
                        <div className="me-2">
                            <Image src={profile.gambar} className="rounded text-white" height={60} width={60} alt="Potret seorang wanita cantik" />
                        </div>
                        <div className="w-100">
                            {/* <textarea className="w-100" id="textkomen" style={{ resize: "none", backgroundColor: "rgb(40, 40, 40)", outline: "none", color: "rgb(200, 200, 200)" }}></textarea> */}
                            <div className="mb-2" style={{ height: "175px", minHeight: "150px" }}>
                                {StatusText === "Tulisan" ?
                                    <CodeEditor
                                        mode={"markdown"}
                                        value={Text}
                                        onChange={() => setText(TextKodeEditor!.editor.getValue())}
                                        refData={(ins: ReactAce) => { TextKodeEditor = ins }}
                                        autoComplete={false}
                                    />
                                    :
                                    <div className="h-100 p-2 text-white" style={{ background: "rgb(60, 60, 60)", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin" }}>
                                        <ReactMarkdown
                                            // eslint-disable-next-line react/no-children-prop
                                            children={Text}
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return !inline && match ? (
                                                        <SyntaxHighlighter
                                                            // eslint-disable-next-line react/no-children-prop
                                                            children={String(children)}
                                                            style={tomorrow as any}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            customStyle={{ margin: "0px" }}
                                                            {...props}
                                                        />
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                },
                                                p({ node, className, children, ...props }) {
                                                    return (
                                                        <p style={{ margin: "0px" }} {...props}>
                                                            {children}
                                                        </p>
                                                    )
                                                }
                                            }}
                                        />
                                    </div>
                                }
                            </div>
                            <button className={`${styles['tombol-lainnya']} ${(StatusText === "Tulisan" ? styles['tombol-lainnya-aktif'] : '')}`} onClick={() => setStatusText("Tulisan")}>Tulisan</button>
                            <button className={`${styles['tombol-lainnya']} ${(StatusText === "Output" ? styles['tombol-lainnya-aktif'] : '')}`} onClick={() => setStatusText("Output")}>Output</button>
                            <button className="float-end text-white btn" style={{ background: "#337d32", borderColor: "rgb(40, 40, 40)" }} onClick={KirimDiskusi}>Kirim</button>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        {data.diskusi.map((v, i) => {
                            return (
                                <div key={i} className="d-flex flex-row mb-2">
                                    <div className="me-2">
                                        <Image src={v.user.gambarurl} className="rounded text-white" height={60} width={60} alt="Potret seorang wanita cantik" />
                                    </div>
                                    <div className="ms-2 w-100">
                                        <div className="mb-1">
                                            <a href={`/profile/`} className={`me-3 text-decoration-none ${v.user.admin ? styles['text-admin'] : v.user.moderator ? styles['text-moderator'] : 'text-white'}`}>{v.user.username}</a>
                                            <span className="text-white-50 me-3">{v.bikin as any}</span>
                                            {(v.user.username === profile.username || profile.moderator || profile.admin) &&
                                                <i className="bi bi-trash" role={"button"} onClick={() => { setIdDiskusiHapus(v.id); setTunjukkinModal(true) }} style={{ color: "red" }}></i>
                                            }
                                        </div>
                                        <div className="text-white mb-2" style={{ maxHeight: "750px" }}>
                                            <ReactMarkdown
                                                // eslint-disable-next-line react/no-children-prop
                                                children={v.text}
                                                components={{
                                                    code({ node, inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return !inline && match ? (
                                                            <SyntaxHighlighter
                                                                // eslint-disable-next-line react/no-children-prop
                                                                children={String(children)}
                                                                style={tomorrow as any}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                customStyle={{ margin: "0px" }}
                                                                {...props}
                                                            />
                                                        ) : (
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    },
                                                    p({ node, className, children, ...props }) {
                                                        return (
                                                            <p style={{ margin: "0px" }} {...props}>
                                                                {children}
                                                            </p>
                                                        )
                                                    }
                                                }}
                                            />
                                        </div>
                                        <span className="text-white me-2" id={"diskusi-" + v.id}>{JSON.parse(v.upvote).length - JSON.parse(v.downvote).length}</span>
                                        <i className="bi bi-caret-up-fill me-2" id={'up-' + v.id} role={"button"} onClick={(e) => VoteDiskusi(e, v.id, "up")} style={{ color: (v.apakahSudahVote === "up" ? 'green' : 'rgb(150, 150, 150)') }}></i>
                                        <i className="bi bi-caret-down-fill" id={'down-' + v.id} role={"button"} onClick={(e) => VoteDiskusi(e, v.id, "down")} style={{ color: (v.apakahSudahVote === "down" ? 'red' : 'rgb(150, 150, 150)') }}></i>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={TunjukkinModal}
                onRequestClose={() => setTunjukkinModal(false)}
                style={{ content: StyleModalKonten, overlay: StyleModalOverlay }}
            >
                <div className="fs-5 text-white mb-2">Hapus diskusi</div>
                <p className="fs-6" style={{ color: "rgb(200, 200, 200)" }}>Kamu yakin ingin menghapus diskusi?</p>
                <div className="float-end">
                    <button className="me-4" onClick={() => setTunjukkinModal(false)} style={{ background: "transparent", border: "0px solid", color: "#1392bd" }}>Tidak</button>
                    <button className="me-3" onClick={() => { setTunjukkinModal(false); HapusDiskusi() }} style={{ background: "transparent", border: "0px solid", color: "#1392bd" }}>Iya</button>
                </div>
            </Modal>
        </>
    )
}