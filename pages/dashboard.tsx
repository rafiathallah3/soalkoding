import axios from 'axios';
import Link from 'next/link';
import { BaseSyntheticEvent } from 'react';
import Background from '../components/background';
import Navbar from '../components/navbar';

export default function Dashboard() {
    const TombolLogout = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        await axios.post('api/logout');
    }

    return (
        <Background>
            <style jsx>{`
            .scrollbar-primary::-webkit-scrollbar-thumb {
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
                background-color: #4285F4;
            }

            .bi-discord:hover {
                color: rgb(114,137,218);
            }

            .bi-instagram:hover {
                color: #E1306C; 
            }

            .bi-youtube:hover {
                color: red;
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
            <Navbar />
            
            <div className="container">
                <div className="row p-3 mb-4 rounded-3" style={{background: "linear-gradient(rgb(39, 40, 41), rgb(41, 42, 43))", border: "1px solid rgb(61, 61, 61)"}}>
                    <div className='container-fluid mb-4'>
                        <button className='btn btn-outline-danger' style={{float: "right"}}>
                            {"Berikutnya "}
                            <i className='bi bi-arrow-right'></i>
                        </button>
                        <button className='me-4 btn btn-outline-success' style={{float: "right"}}>Latihan</button>
                        <button className='btn btn-outline-secondary fs-6 me-4'>Tags</button>
                        <span className='text-warning bg-transparent fs-5'>Status: MEDIUM</span>
                    </div>
                    <div style={{height: "200px", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin"}}>
                        <Link href={"/soal"}>
                        <a className="fs-4 fw-bold text-black text-decoration-none text-white">Jumlah appel</a>
                        </Link>
                        <p className="fs-5" style={{whiteSpace: "pre-wrap", color: "rgb(196, 196, 196)"}}>
                        {`You are given an odd-length array of integers, in which all of them are the same, except for one single number.
Complete the method which accepts such an array, and returns that single different number.
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
The input array will always be valid! (odd-length >= 3)
`}
                        </p>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="p-2 text-white rounded-3 text-center h-100" style={{background: "linear-gradient(rgb(39, 40, 41), rgb(41, 42, 43))", border: "1px solid rgb(61, 61, 61)"}}>
                            <h2>Total soal yang sudah dikerjakan</h2>
                            <span className='text-success me-5 fs-4'>Soal Easy: 0</span>
                            <span className='text-warning me-5 fs-4'>Soal Medium: 0</span>
                            <span className='text-danger fs-4'>Soal Susah: 0</span>
                            <div className='mb-4'></div>
                            <button className="btn btn-outline-success" type="button">Kerjakan soal lainnya!</button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="p-3 rounded-3 d-flex flex-row h-100" style={{background: "linear-gradient(rgb(39, 40, 41), rgb(41, 42, 43))", border: "1px solid rgb(61, 61, 61)"}}>
                            <div className='text-white me-4' style={{fontSize: "50px"}}>
                                <i className='bi bi-box-seam-fill'></i>
                            </div>
                            <div className='text-white'>
                                <h4>Mau Membuat soal?</h4>
                                <p>Kalian mempunyai ide soal yang kreatif bahkan tidak ada satupun orang yang bisa menjawab selain kamu? Buat sekarang dan kirim ke orang lain!</p>
                                <Link href='/soal/buat'>
                                    <a className='btn btn-outline-info'>Buat!</a>
                                </Link>
                            </div>

                            {/* <h2>Discussion</h2>
                            <a href="#!" className='fs-3 me-4' style={{color: "white"}} target="_blank" rel="noopener noreferrer"><i className='bi bi-discord' style={{transition: ".2s"}}></i></a>
                            <a href="https://instagram.com/dhyrbfy" className='fs-3 me-4' style={{color: "white"}} target="_blank" rel="noopener noreferrer"><i className='bi bi-instagram' style={{transition: ".2s"}}></i></a>
                            <a href="https://youtube.com/" className='fs-3 me-4' style={{color: "white"}} target="_blank" rel="noopener noreferrer"><i className='bi bi-youtube' style={{transition: ".2s"}}></i></a>
                            <div></div> */}
                        </div>
                    </div>
                </div>

                <div className="row p-3 mb-4 rounded-3" style={{background: "linear-gradient(rgb(39, 40, 41), rgb(41, 42, 43))", border: "1px solid rgb(61, 61, 61)"}}>
                    <div className='table-responsive'>
                        <table className="table text-white">
                            <thead>
                                <tr>
                                    <th scope="col" style={{width: "4.6%"}}>Status</th>
                                    <th scope="col" style={{width: "30.6%"}}>Judul</th>
                                    <th scope="col" style={{width: "40.6%"}}>Deskripsi</th>
                                    <th scope="col" style={{width: "15%"}}>Tingkat Kesulitan</th>
                                    <th scope="col">Pembuat</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row" className='text-center'><i className='bi bi-check-lg text-success'></i></th>
                                    <td>
                                        <a href="#!" className='text-decoration-none text-white'>Siapa Menang</a>
                                    </td>
                                    <td>Baris yang paling banyak dia pemenang!</td>
                                    <td className='text-success'>Mudah</td>
                                    <td>rapithon39125346</td>
                                </tr>
                                <tr>
                                    <th scope="row" className='text-center'><i className='bi bi-dash-lg'></i></th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td className='text-warning'>Lumayan</td>
                                    <td>rapithon39125346</td>
                                </tr>
                                <tr>
                                    <th scope="row" className='text-center'><i className='bi bi-dash-lg'></i></th>
                                    <td colSpan={2}>Larry the Bird</td>
                                    <td className='text-danger'>Susah</td>
                                    <td>rapithon39125346</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Background>
    )
}