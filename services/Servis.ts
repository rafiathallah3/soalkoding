import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../database/prisma";
import { decrypt } from "../database/UbahKeHash";
import jwt from 'jsonwebtoken';
import { HasilKompiler, OutputCompilerGodbolt, OutputCompilerWandbox, TipeInfoKode, TipeKonfirmasiJawaban, WarnaStatus } from "../types/tipe";
import { DapatinServisKompiler } from "./TemplateBahasaProgram";

export async function UpdateInfoAkun(req: NextApiRequest, res: NextApiResponse, DapatinUser: boolean) {
    const infoakun = getCookie('infoakun', { req, res }) as string;
    if (infoakun === undefined) return { redirect: { destination: '/login', permanent: false } };

    try {
        var DapatinToken = await axios.post("http://localhost:3003/api/dapatintokenbaru", {}, {
            headers: { cookie: req.headers.cookie } as any
        }).then(d => d.data);

        setCookie('infoakun', DapatinToken, {
            req, res,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
            secure: process.env.NODE_ENV !== "development"
        });
    } catch {
        deleteCookie('infoakun', { req, res });
        deleteCookie('perbaruitoken', { req, res });
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    if(!DapatinUser) return DapatinToken;

    const DataUser = await prisma.akun.findUnique({
        where: {
            id: JSON.parse(decrypt((jwt.verify(DapatinToken, process.env.TOKENRAHASIA!) as any).datanya)).id
        },
        include: {
            akungithub: {
                select: { username: true }
            }
        }
    });

    if(DataUser === null) return { redirect: { destination: '/login', permanent: false } }
    if(DataUser.username === "" || DataUser.email === "") return { redirect: { destination: '/register/daftargithub', permanent: false } }

    return DataUser;
}

export async function JalaninKompiler(req: NextApiRequest) {
    const { buat, kode, idsoal, w: StatusJawaban, bahasa } = req.body;

    const InfoKompiler = DapatinServisKompiler(bahasa, kode);
    if(InfoKompiler.NamaKompiler === "Tidak Ada") return 404;

    let HasilGabunganKode;
    if(buat) {
        const ParseBuat = JSON.parse(buat) as { [bahasa: string]: TipeInfoKode };
        if(ParseBuat[bahasa] === undefined || ParseBuat[bahasa].listjawaban === undefined) return 403;
        
        HasilGabunganKode = InfoKompiler.GabunganKode + '\n' + ParseBuat[bahasa].listjawaban;
        if(bahasa === "javascript") {
            HasilGabunganKode += '\n' + 'console.timeEnd("waktu");';
        }
    } else {
        const DataSoal = await prisma.soal.findUnique({
            where: {
                id: idsoal
            },
            include: {
                kumpulanjawaban: {
                    where: {
                        bahasa: bahasa
                    }
                }
            }
        });
    
        if(DataSoal === null || StatusJawaban === undefined) return 404;
        // HasilGabunganKode = 'import json\n' + kode + '\n' + InfoKompiler.FungsiApakahSama + '\n' + (StatusJawaban === "jawaban" ? DataSoal.listjawaban : DataSoal.contohjawaban);
        HasilGabunganKode = InfoKompiler.GabunganKode + '\n' + (StatusJawaban === "jawaban" ? DataSoal.kumpulanjawaban[0].listjawaban : DataSoal.kumpulanjawaban[0].contohjawaban);
        if(bahasa === "javascript") {
            HasilGabunganKode += '\n' + 'console.timeEnd("waktu");';
        }
    }

    // console.log(HasilGabunganKode);

    try {
        if(InfoKompiler.NamaKompiler === "Godbolt") {
            const data = await axios.post(`https://godbolt.org/api/compiler/${InfoKompiler.Kompiler}/compile`, {
                "source": HasilGabunganKode,
                "compiler": InfoKompiler.Kompiler,
                "options": {
                    "userArguments": "",
                    "executeParameters": {
                        "args": "",
                        "stdin": ""
                    },
                    "compilerOptions": {
                        "executorRequest": true,
                        "skipAsm": true
                    },
                    "filters": {
                        "execute": true
                    },
                    "tools": [],
                    "libraries": []
                },
                "lang": "python",
                "files": [],
                "allowStoreCodeDebug": true
            }, {
                headers: {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                }
            }).then(d => d.data) as OutputCompilerGodbolt;
    
            // console.log(data);
            if(data.stderr.length > 0) {
                // console.log(data.stderr);
                return { error: data.stderr.map((v) => v.text + '\n').toString() };
            }
            
            const ParseOutput: TipeKonfirmasiJawaban[] = data.stdout.map((v) => JSON.parse(v.text));
            return { 
                data: ParseOutput,
                waktu: data.execTime,
                lulus: ParseOutput.filter((v) => v.hasil === v.jawaban).length,
                gagal: ParseOutput.filter((v) => v.hasil !== v.jawaban).length
            };
        }

        const data = await axios.post("https://wandbox.org/api/compile.json", {
            code: HasilGabunganKode,
            compiler: InfoKompiler.Kompiler
        }).then(d =>  d.data) as OutputCompilerWandbox;

        if(data.status === "1") return {error: data.program_error};

        const ParseOutput: TipeKonfirmasiJawaban[] = data.program_output.split('\n').filter((v) => !v.includes("waktu") && v !== "").map((v) => JSON.parse(v));
        return { 
            data: ParseOutput,
            waktu: data.program_output.split('\n').filter((v) => v.includes("waktu"))[0].split(' ')[1].replace('ms', "").split('.')[1].replace('0', ""),
            lulus: ParseOutput.filter((v) => v.hasil === v.jawaban).length,
            gagal: ParseOutput.filter((v) => v.hasil !== v.jawaban).length
        };
    } catch {
        return 500;
    }
}

export const KirimNotifikasi = (status: WarnaStatus, pesan: string, { req, res }: { req: NextApiRequest, res: NextApiResponse }): void => setCookie('notif', { status, pesan }, { req, res, maxAge: 5 })