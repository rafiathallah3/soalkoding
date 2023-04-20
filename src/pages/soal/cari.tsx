import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import FavoritKomponen from "../../../components/Favorit";
import Navbar from "../../../components/navbar"
import Select from 'react-select';
import { NextApiRequest, NextApiResponse } from "next";
import { IAkun, ISoal } from "../../../types/tipe";
import Head from "next/head";
import InfiniteScroll from 'react-infinite-scroller';
import styles from '../../styles/IndexSolusi.module.css';
import { ApakahSudahMasuk } from "../../../lib/Servis";
import { DataModel } from "../../../lib/Model";

export async function getServerSideProps({ query, req, res }: { query: { kesusahan: string, urutan: string, kerjakan: string, tags: string, bahasa: string }, req: NextApiRequest, res: NextApiResponse }) {
    const session = await ApakahSudahMasuk(req, res);
    if(!session.props) return session;

    const KondisiSort: { [key: string]: number | string } = {};
    if(query.urutan === "baru") {
        KondisiSort.createdAt = "desc";
    }
    if(query.urutan === "lama") {
        KondisiSort.createdAt = "asc";
    }
    if(query.urutan === "banyakfavorit") {
        KondisiSort.favorit = "desc";
    }
    if(query.urutan === "sedikitfavorit") {
        KondisiSort.favorit = "asc";
    }
    if(query.urutan === "banyakselesai") {
        KondisiSort.solusi = "desc";
    }
    if(query.urutan === "sedikitselesai") {
        KondisiSort.solusi = "asc";
    }

    const KumpulanDataSoal = await DataModel.SoalModel.find({ public: true })
        .populate("pembuat")
        .populate({ path: "solusi", populate: { path: "user" } })
        .populate({ path: "favorit", populate: { path: "user", select: "_id" } })
        .sort(KondisiSort as unknown as any) as ISoal[];
    
    let ParseKumpulanDataSoal = (JSON.parse(JSON.stringify(KumpulanDataSoal)) as ISoal[]).map((v) => ({
        ...v,
        ApakahSudahSelesai: v.solusi.find((v) => v.user._id.toString() === session.props.Akun.id) !== undefined,
        suka_ngk: v.favorit.find((v) => v.user._id.toString() === session.props.Akun.id) !== undefined
    }));

    if(query.kesusahan) {
        const LevelKesusahan = query.kesusahan.split(",")
        ParseKumpulanDataSoal = ParseKumpulanDataSoal.filter((v) => LevelKesusahan.includes(v.level.toString()));
    }

    if(query.kerjakan) {
        ParseKumpulanDataSoal = ParseKumpulanDataSoal.filter((v) => query.kerjakan === "sudah" ? v.solusi.filter((d) => d.user._id.toString() === session.props.Akun.id).length > 0 : v.solusi.filter((d) => d.user._id.toString() === session.props.Akun.id).length <= 0);
    }

    if(query.tags) {
        const Tags = query.tags.split(",");
        ParseKumpulanDataSoal = ParseKumpulanDataSoal.filter((v) => Tags.every((j) => v.tags.includes(j)));
    }

    if(query.bahasa) {
        ParseKumpulanDataSoal = ParseKumpulanDataSoal.filter((v) => v.BahasaSoal.filter((k) => k.bahasa === query.bahasa).length > 0);
    }

    return {
        props: {
            data: ParseKumpulanDataSoal,
            Akun: session.props.Akun,
            query,
        }
    }
}

export default function Cari({ data, query, Akun }: { data: (ISoal & { ApakahSudahSelesai: boolean, suka_ngk: boolean })[], query: { kesusahan: string, urutan: string, kerjakan: string, tags: string, bahasa: string }, Akun: IAkun }) {
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
    const [KumpulanSoal, setKumpulanSoal] = useState<(ISoal & { ApakahSudahSelesai: boolean, suka_ngk: boolean })[]>(data.slice(undefined, 10));
    const [BerapaSoal, setBerapaSoal] = useState(10);
    const [ApakahMasiAda, setApakahMasiAda] = useState(true);

    const TambahinQuery = async () => {
        window.location = `/soal/cari?${new URLSearchParams(QueryURL).toString()}` as any;
    }

    const SoalLainnya = (n: number) => {
        setKumpulanSoal(data.slice(undefined, BerapaSoal + 10));
        setBerapaSoal(BerapaSoal + 10);

        setApakahMasiAda(!(KumpulanSoal.length >= data.length));
    }

    useEffect(() => {
        if (TutupMenu) {
            TambahinQuery();
            setTutupMenu(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TutupMenu])

    return (
        <>
            <Head>
                <title>Cari Soal</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar profile={Akun} />
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
                background: rgb(48, 48, 48);
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
                            <InfiniteScroll
                                pageStart={0}
                                loadMore={SoalLainnya}
                                hasMore={ApakahMasiAda}
                                loader={<span className="text-white text-center">Loading...</span>}
                                useWindow={false}
                            >
                                {KumpulanSoal.map((v, i) => {
                                    return (
                                        <div key={i} className="p-3 mb-3 rounded-2" style={{ background: "rgb(48, 48, 48)" }}>
                                            <div className="d-flex">
                                                <div className="text-white flex-grow-1">
                                                    <div className="px-1 mb-2" style={{ fontSize: "17px" }}>
                                                        <a href={`/soal/${v._id}/latihan`} className="text-white text-decoration-none me-3">{v.namasoal}</a>
                                                        <span className={"p-2 fs-6 me-2 " + (v.level <= 2 ? "text-white" : v.level <= 4 ? "text-warning" : "text-danger")} style={{ background: "rgb(55, 55, 55)" }}>Level {v.level}</span>
                                                        {v.ApakahSudahSelesai &&
                                                            <i className="bi bi-check-lg"></i>
                                                        }
                                                        <span className="float-end text-white-50">{new Date(v.createdAt).getDate() + '/' + (new Date(v.createdAt).getMonth() + 1) + '/' + new Date(v.createdAt).getFullYear()}</span>
                                                    </div>
                                                    <div className="mb-1">
                                                        <span className="me-3">
                                                            <i className="bi bi-person-fill me-1"></i>
                                                            <a className={`me-3 text-decoration-none ${v.pembuat.admin ? styles['text-admin'] : v.pembuat.moderator ? styles['text-moderator'] : 'text-white'}`} href={`/profile/` + v.pembuat.username}>{v.pembuat.username}</a>
                                                        </span>
                                                        <FavoritKomponen data={{ suka_ngk: v.suka_ngk, berapa: v.favorit.length, idsoal: v._id }} />
                                                        <span className="me-3" title="Jumlah solusi">
                                                            <i className="bi bi-calendar-check me-1"></i>
                                                            {v.solusi.length}
                                                        </span>
                                                        {/* <span className="me-3" title="Kepuasan orang dalam mengerjakan soal">
                                                        <i className="bi bi-eyeglasses me-1"></i>
                                                        30
                                                    </span> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-4 px-3 py-2 text-white" style={{ maxHeight: "180px", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "thin" }}>
                                                <ReactMarkdown
                                                    // eslint-disable-next-line react/no-children-prop
                                                    children={v.soal}
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
                                                    {v.BahasaSoal.map((d, di) => {
                                                        return (
                                                            <a key={di} className="text-decoration-none me-3" style={{ color: "rgb(200, 200, 200)" }}>{d.bahasa.charAt(0).toUpperCase() + d.bahasa.slice(1)}</a>
                                                        )
                                                    })}
                                                </div>
                                                <div className="col-6 text-end">
                                                    {v.tags.map((t: string, ti: number) => {
                                                        return (
                                                            <a key={ti} className="text-decoration-none me-3" style={{ color: "rgb(200, 200, 200)" }}>{t}</a>
                                                        )
                                                    })}
                                                    <i className="bi bi-tags-fill me-3 fs-5" style={{ color: "rgb(200, 200, 200)" }}></i>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </InfiniteScroll>
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
                                            { value: "lua", label: "Lua" },
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