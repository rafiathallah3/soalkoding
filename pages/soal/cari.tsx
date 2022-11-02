import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import FavoritKomponen from "../../components/Favorit";
import Navbar from "../../components/navbar"
import Select from 'react-select';
import { useRouter } from "next/router";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdateInfoAkun } from "../../services/Servis";
import { Akun } from "@prisma/client";

const test = `
Diberikan kalkulator, tetapi kalkulator tersebut hanya memiliki 3 angka yaitu a, b, dan c.
Kalkulator tersebut hanya bisa menggunakan operasi tambah. Kemudian diberikan sejumlah Q
bilangan bulat n. Tantangannya mudah saja. Dari bilangan bulat n tersebut, carilah jumlah
minimum angka yang perlu ditekan agar kalkulator bisa menampilkan bilangan bulat n.

Catatan: Kalau angka kalkulator tidak bisa menghasilkan angka yang ditentukan maka return 0 dan angka kalkulator tidak akan berisi 0.

Input: 
1. List angka kalkulator
2. List angka yang ditentukan dari angka kalkulator

Contohnya:
~~~python
Solusi([2, 3, 5], [10, 9, 17]) # -> [2, 3, 4]
# Baris pertama dapat 10 dapat dibentuk minimum dengan 2 nomor (5 + 5)
# Baris kedua dapat 9 dapat dibentuk minimum dengan 3 nomor (3 + 3 + 3)
# Baris Ketiga 17 dapat dibentuk minimum dengan 4 nomor (5 + 5 + 5 + 2)

Solusi([5, 8, 9], [6, 13]) # -> [0, 2]
# Baris pertama dapat 0 karena tidak ada angka yang bisa menghasilkan 6
# Baris kedua 13 dapat dibentuk minimum dengan 2 nomor (5 + 9)
~~~
`

export async function getServerSideProps({ query, req, res }: { query: any, req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { redirect: string };
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    try {
        const data = await axios.post(`${process.env.NAMAWEBSITE}/api/soal/dapatinCari`, {
            ...query
        }, {
            headers: { cookie: req.headers.cookie } as any
        }).then(d => d.data);

        return {
            props: {
                query
            }
        }
    } catch (e) {
        return {
            notFound: true
        }
    }
}

export default function Cari({ data, query }: { data: any, query: { kesusahan: string, urutan: string, kerjakan: string, tags: string, bahasa: string } }) {
    const [QueryURL, setQueryURL] = useState<{
        kerjakan?: string,
        tags?: string,
        bahasa?: string,
        kesusahan?: string,
        urutan?: string,
        namanya?: string,
        orangnya?: string
    }>({ ...query });

    const [TutupMenu, setTutupMenu] = useState(false);

    const router = useRouter();

    const TambahinQuery = () => {
        router.push('/soal/cari', {
            query: Object.keys(QueryURL).filter(v => QueryURL[v as keyof typeof QueryURL] !== undefined || v !== "").reduce((res: any, k) => (res[k] = QueryURL[k as keyof typeof QueryURL], res), {})
        })
    }

    useEffect(() => {
        if (TutupMenu) {
            TambahinQuery();
            console.log("ROBLOX");
            setTutupMenu(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TutupMenu])

    return (
        <>
            <Navbar />
            <style jsx>{`
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
                transition: 0.2s;
            }

            .tombol-keren:hover { 
                color: white !important;
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

            @media (min-width: 1200px) {
                .container{
                    max-width: 80%;
                }
            }
            `}</style>
            <div className="container">
                <div className="px-3">
                    <div className="row">
                        <div className="col-10">
                            <div className="p-3 mb-3 rounded-2" style={{ background: "rgb(48, 48, 48)" }}>
                                <div className="d-flex">
                                    <div className="text-white flex-grow-1">
                                        <div className="p-1" style={{ fontSize: "17px" }}>
                                            <span className="me-2">3 Angka kalkulator</span>
                                            <i className="bi bi-check-lg"></i>
                                            <span className="float-end text-white-50">2022</span>
                                        </div>
                                        <div className="mb-3">
                                            <span className="me-3">
                                                <i className="bi bi-person-fill me-1"></i>
                                                <a className="text-white text-decoration-none" href="#">rafiathallah3</a>
                                            </span>
                                            <FavoritKomponen data={{ suka_ngk: true, berapa: 1, idsoal: "Sss" }} />
                                            <span className="me-3" title="Jumlah solusi">
                                                <i className="bi bi-calendar-check me-1"></i>
                                                30
                                            </span>
                                            <span className="me-3" title="Kepuasan orang dalam mengerjakan soal">
                                                <i className="bi bi-eyeglasses me-1"></i>
                                                30
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4 px-3 py-2 text-white" style={{ maxHeight: "200px", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin" }}>
                                    <ReactMarkdown
                                        // eslint-disable-next-line react/no-children-prop
                                        children={test}
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '');
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
                                </div>
                                <hr className="text-white mb-2" style={{ marginBottom: "0px" }} />
                                <div className="row">
                                    <div className="col-6">
                                        <a className="text-decoration-none me-3" style={{ color: "rgb(200, 200, 200)" }} href="#">Javascript</a>
                                        <a className="text-decoration-none me-3" style={{ color: "rgb(200, 200, 200)" }} href="#">Python</a>
                                    </div>
                                    <div className="col-6 text-end">
                                        <a className="text-decoration-none me-3" style={{ color: "rgb(200, 200, 200)" }}>Array</a>
                                        <a className="text-decoration-none me-3" style={{ color: "rgb(200, 200, 200)" }}>Logika</a>
                                        <a className="text-decoration-none me-3" style={{ color: "rgb(200, 200, 200)" }}>Bahasa Indonesia</a>
                                        <i className="bi bi-tags-fill me-3 fs-5" style={{ color: "rgb(200, 200, 200)" }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-2 rounded-1 filter-jawaban">
                                <div className="mb-2">
                                    <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Kerjakan yang</div>
                                    <Select
                                        name="kerjakan"
                                        options={[
                                            { value: "sudah", label: "Sudah" },
                                            { value: "belum", label: "Belum" },
                                        ]}
                                        styles={
                                            {
                                                control: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(70, 70, 70)", color: "rgb(180, 180, 180)" }),
                                                indicatorSeparator: () => ({}),
                                                dropdownIndicator: (base, state) => ({ ...base, transform: state.isFocused ? "rotate(180deg)" : "", color: "rgb(180, 180, 180)" }),
                                                option: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)", color: "rgb(180, 180, 180)", borderColor: "rgb(180, 180, 180)", ":hover": { backgroundColor: "#19699c" } }),
                                                menu: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)" }),
                                                input: base => ({ ...base, color: "rgb(180, 180, 180)" }),
                                                multiValue: base => ({ ...base, backgroundColor: "rgb(60, 60, 60)" }),
                                                multiValueLabel: base => ({ ...base, backgroundColor: "rgb(60, 60, 60)", color: "rgb(180, 180, 180)" }),
                                                multiValueRemove: base => ({ ...base, ":hover": {} }),
                                                singleValue: base => ({ ...base, color: "rgb(180, 180, 180)" })
                                            }
                                        }
                                        onMenuClose={() => setTutupMenu(true)}
                                        onChange={(v) => setQueryURL({ ...QueryURL, kerjakan: v?.value })}
                                        defaultValue={query.kerjakan ? { value: query.kerjakan, label: query.kerjakan.charAt(0).toUpperCase() + query.kerjakan.slice(1) } : undefined}
                                    />
                                </div>
                                <div className="mb-2">
                                    <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Tags</div>
                                    <Select
                                        name="tags"
                                        options={["Algortima", "Array", "Sorting", "Dasar", "Matriks", "Matematika", "Logika", "RegEx", "String", "Inggris", "Bahasa"].map((v) => ({ value: v, label: v }))}
                                        styles={
                                            {
                                                control: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(70, 70, 70)", color: "rgb(180, 180, 180)" }),
                                                indicatorSeparator: () => ({}),
                                                dropdownIndicator: (base, state) => ({ ...base, transform: state.isFocused ? "rotate(180deg)" : "", color: "rgb(180, 180, 180)" }),
                                                option: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)", color: "rgb(180, 180, 180)", borderColor: "rgb(180, 180, 180)", ":hover": { backgroundColor: "#19699c" } }),
                                                menu: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)" }),
                                                input: base => ({ ...base, color: "rgb(180, 180, 180)" }),
                                                multiValue: base => ({ ...base, backgroundColor: "rgb(60, 60, 60)" }),
                                                multiValueLabel: base => ({ ...base, backgroundColor: "rgb(60, 60, 60)", color: "rgb(180, 180, 180)" }),
                                                multiValueRemove: base => ({ ...base, ":hover": {} })
                                            }
                                        }
                                        closeMenuOnSelect={false}
                                        isMulti
                                        onMenuClose={TambahinQuery}
                                        onChange={(v) => setQueryURL({ ...QueryURL, tags: v.map((d) => d.value).toString() })}
                                        defaultValue={query.tags ? query.tags.split(',').map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) })) : undefined}
                                    />
                                </div>
                                <div className="mb-2">
                                    <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Bahasa</div>
                                    <Select
                                        name="tags"
                                        options={[
                                            { value: "python", label: "Python" },
                                            { value: "javascript", label: "Javascript" },
                                        ]}
                                        styles={
                                            {
                                                control: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(70, 70, 70)", color: "rgb(180, 180, 180)" }),
                                                indicatorSeparator: () => ({}),
                                                dropdownIndicator: (base, state) => ({ ...base, transform: state.isFocused ? "rotate(180deg)" : "", color: "rgb(180, 180, 180)" }),
                                                option: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)", color: "rgb(180, 180, 180)", borderColor: "rgb(180, 180, 180)", ":hover": { backgroundColor: "#19699c" } }),
                                                menu: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)" }),
                                                input: base => ({ ...base, color: "rgb(180, 180, 180)" }),
                                                multiValue: base => ({ ...base, backgroundColor: "rgb(60, 60, 60)" }),
                                                multiValueLabel: base => ({ ...base, backgroundColor: "rgb(60, 60, 60)", color: "rgb(180, 180, 180)" }),
                                                multiValueRemove: base => ({ ...base, ":hover": {} }),
                                                singleValue: base => ({ ...base, color: "rgb(180, 180, 180)" })
                                            }
                                        }
                                        onMenuClose={() => setTutupMenu(true)}
                                        onChange={(v) => setQueryURL({ ...QueryURL, bahasa: v?.value })}
                                        defaultValue={query.bahasa ? { value: query.bahasa, label: query.bahasa.charAt(0).toUpperCase() + query.bahasa.slice(1) } : undefined}
                                    />
                                </div>
                                <div className="mb-2">
                                    <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Tingkat kesusahan</div>
                                    <Select
                                        name="kesusahan"
                                        options={
                                            [1, 2, 3, 4, 5].map((v) => ({ value: v.toString(), label: `Level ${v}` }))
                                        }
                                        styles={
                                            {
                                                control: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(70, 70, 70)", color: "rgb(180, 180, 180)" }),
                                                indicatorSeparator: () => ({}),
                                                dropdownIndicator: (base, state) => ({ ...base, transform: state.isFocused ? "rotate(180deg)" : "", color: "rgb(180, 180, 180)" }),
                                                option: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)", color: "rgb(180, 180, 180)", borderColor: "rgb(180, 180, 180)", ":hover": { backgroundColor: "#19699c" } }),
                                                menu: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)" }),
                                                input: base => ({ ...base, color: "rgb(180, 180, 180)" }),
                                                multiValue: base => ({ ...base, backgroundColor: "rgb(60, 60, 60)" }),
                                                multiValueLabel: base => ({ ...base, backgroundColor: "rgb(60, 60, 60)", color: "rgb(180, 180, 180)" }),
                                                multiValueRemove: base => ({ ...base, ":hover": {} })
                                            }
                                        }
                                        closeMenuOnSelect={false}
                                        isMulti
                                        onMenuClose={TambahinQuery}
                                        onChange={(v) => setQueryURL({ ...QueryURL, kesusahan: v.map((d) => d.value).toString() })}
                                        defaultValue={query.kesusahan ? query.kesusahan.split(',').map((v) => ({ value: v, label: `Level ${v}` })) : undefined}
                                    />
                                </div>
                                <div className="mb-2">
                                    <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Urutan</div>
                                    <Select
                                        name="urutan"
                                        options={[
                                            { value: "baru", label: "Baru" },
                                            { value: "lama", label: "Lama" },
                                            { value: "banyakfavorit", label: "Banyak Favorit" },
                                            { value: "sedikitfavorit", label: "Sedikit Favorit" },
                                            { value: "banyakselesai", label: "Banyak Selesai" },
                                            { value: "sedikitselesai", label: "Sedikit Selesai" },
                                            { value: "tingkatkepuasan", label: "Tingkat Kepuasan" },
                                        ]}
                                        styles={
                                            {
                                                control: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)", borderColor: "rgb(70, 70, 70)", color: "rgb(180, 180, 180)" }),
                                                indicatorSeparator: () => ({}),
                                                dropdownIndicator: (base, state) => ({ ...base, transform: state.isFocused ? "rotate(180deg)" : "", color: "rgb(180, 180, 180)" }),
                                                option: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)", color: "rgb(180, 180, 180)", borderColor: "rgb(180, 180, 180)", ":hover": { backgroundColor: "#19699c" } }),
                                                menu: base => ({ ...base, backgroundColor: "rgb(40, 40, 40)" }),
                                                input: base => ({ ...base, color: "rgb(180, 180, 180)" }),
                                                multiValue: base => ({ ...base, backgroundColor: "rgb(60, 60, 60)" }),
                                                multiValueLabel: base => ({ ...base, backgroundColor: "rgb(60, 60, 60)", color: "rgb(180, 180, 180)" }),
                                                multiValueRemove: base => ({ ...base, ":hover": {} }),
                                                singleValue: base => ({ ...base, color: "rgb(180, 180, 180)" })
                                            }
                                        }
                                        onMenuClose={() => setTutupMenu(true)}
                                        onChange={(v) => setQueryURL({ ...QueryURL, urutan: v?.value })}
                                        defaultValue={query.urutan ? { value: query.urutan, label: query.urutan.charAt(0).toUpperCase() + query.urutan.slice(1) } : undefined}
                                    />
                                </div>
                                <div className="mb-2">
                                    <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Cari soal berdasarkan namanya</div>
                                    <input className="form-control" type="text" name="namanya" style={{ color: "rgb(180, 180, 180)", backgroundColor: "rgb(40, 40, 40)", border: "1px solid rgb(50, 50, 50)" }} />
                                </div>
                                <div className="mb-2">
                                    <div className="mb-2 fw-bold" style={{ color: "rgb(220, 220, 220)", fontSize: "17px" }}>Cari soal berdasarkan orangnya</div>
                                    <input className="form-control" type="text" name="orangnya" style={{ color: "rgb(180, 180, 180)", backgroundColor: "rgb(40, 40, 40)", border: "1px solid rgb(50, 50, 50)" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}