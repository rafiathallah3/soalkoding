import { Akun } from "@prisma/client";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import FavoritKomponen from "../../../components/Favorit";
import Navbar from "../../../components/navbar";
import { UpdateInfoAkun } from "../../../services/Servis";
import { DataSoal } from "../../../types/tipe";
import styles from '../../../styles/IndexSolusi.module.css'
import { useRouter } from "next/router";

export async function getServerSideProps({ params, req, res }: { params: { soal: string }, req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { redirect: string };
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
                profile: { username: DapatinUser.username, gambar: DapatinUser.gambarurl },
            }
        }
    } catch {
        return {
            notFound: true
        }
    }
}

export default function Diksusi({ data, profile }: { data: DataSoal, profile: { username: string, gambar: string } }) {
    const router = useRouter();

    const SoalBerikutnya = async () => {
        const RandomSoal = await axios.post("/api/soal/dapatinRandomSoal", {}).then(d => d.data.data) as DataSoal;
        router.push(`/soal/${RandomSoal.id}/latihan`);
    }

    return (
        <>
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
                                    <a className="text-decoration-none text-white" href={`/profile/` + data.pembuat.username}>{data.pembuat.username}</a>
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
            </div>
            <h1 className="text-white text-center">Diskusi akan mendatang</h1>
        </>
    )
}