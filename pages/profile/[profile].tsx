import { useRouter } from "next/router";
import Background from "../../components/background";
import Navbar from "../../components/navbar";
import Image from "next/image"


export default function Profile() {
    const router = useRouter();
    const { profile } = router.query;
    console.log(profile);

    return (
        <Background>
            <Navbar/>
            <style>{`
            body {
                overflow: hidden
            }

            .table-striped>tbody>tr:nth-child(odd)>td, 
            .table-striped>tbody>tr:nth-child(odd)>th {
                background-color: #2e2e2e;
                color: white;
            }
            .table-striped>tbody>tr:nth-child(even)>td, 
            .table-striped>tbody>tr:nth-child(even)>th {
                background-color: #3b3b3b;
                color: white;
            }
            `}</style>

            <div className="container">
                <div className="row min-vh-100">
                    <div className="col-3 rounded-1" style={{background: "rgb(48, 48, 48)", height: "28rem"}}>
                        <div className="d-flex flex-row text-white mb-2 mt-2">
                            <Image src="/profile.jpeg" className="rounded-3 text-white" height={80} width={80} alt="Potret seorang wanita cantik" />
                            <div className="ms-2">
                                <h3>rapithon</h3>
                                <p className="text-white-50 fs-6">@rafiathallah3</p>
                            </div>
                        </div>
                        <div className="mb-3">
                            <p className="text-white-50 mb-1">Saya tinggal di</p>
                            <p className="text-white">Malaysia</p>
                        </div>
                        <div className="mb-3">
                            <p className="text-white-50 mb-1">Member sejak</p>
                            <p className="text-white">Agustus 2022</p>
                        </div>
                        <div className="mb-3">
                            <p className="text-white-50 mb-1">Tentang Saya</p>
                            <p className="text-white">Saya suka programming dan kalau dipikir pikir malah kepikiran kocak bet gaming</p>
                        </div>
                        <div className="mb-3">
                            <a className="text-white fs-4 me-3" href="https://github.com" target={"_blank"} rel="noopener noreferrer">
                                <i className="bi bi-discord"></i>
                            </a>
                            <a className="text-white fs-4 me-3" href="https://instagram.com" target={"_blank"} rel="noopener noreferrer">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a className="text-white fs-4 me-3" href="https://twitter.com" target={"_blank"} rel="noopener noreferrer">
                                <i className="bi bi-twitter"></i>
                            </a>
                        </div>
                        <button className="btn btn-dark form-control">
                            Edit PRofile
                        </button>
                    </div>
                    <div className="col-9">
                        <div className="p-1 text-white rounded-3 mb-3" style={{background: "linear-gradient(rgb(39, 40, 41), rgb(41, 42, 43))", border: "1px solid rgb(61, 61, 61)"}}>
                            <h5 className="text-center">Total soal yang sudah dikerjakan</h5>
                            <div className="text-center">
                                <span className='text-success me-5 fs-4'>Soal Easy: 0</span>
                                <span className='text-warning me-5 fs-4'>Soal Medium: 0</span>
                                <span className='text-danger fs-4'>Soal Susah: 0</span>
                            </div>
                        </div>
                        <div className="p-3 text-white rounded-3" style={{background: "linear-gradient(rgb(39, 40, 41), rgb(41, 42, 43))", border: "1px solid rgb(61, 61, 61)", height: "85%"}}>
                            <div className="mb-3">
                                <button className='me-4 btn btn-outline-success'>Soal</button>
                                <button className='me-4 btn btn-outline-success'>Solusi</button>
                                <button className='me-4 btn btn-outline-success'>Diskusi</button>
                            </div>
                            <div>
                                <table className="table table-striped">
                                    <tbody>
                                        <tr>
                                            <td>Murah banget</td>
                                            <td className="text-end">Murah banget</td>
                                        </tr>
                                        <tr>
                                            <td>Murah banget</td>
                                            <td className="text-end">Murah banget</td>
                                        </tr>
                                        <tr>
                                            <td>Murah banget</td>
                                            <td className="text-end">Murah banget</td>
                                        </tr>
                                        <tr>
                                            <td>Murah banget</td>
                                            <td className="text-end">Murah banget</td>
                                        </tr>
                                        <tr>
                                            <td>Murah banget</td>
                                            <td className="text-end">Murah banget</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}