import { NextApiRequest, NextApiResponse } from "next";
import { DataModel } from "./Model";
import { IAkun, ISoal, KeperluanKompiler, OutputCompilerGodbolt, OutputCompilerWandbox, TipeInfoKode, TipeKonfirmasiJawaban, WarnaStatus } from "../types/tipe";
import connectDb from "./mongodb";
import { getServerSession } from "next-auth";
import { deleteCookie, setCookie } from "cookies-next";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import { DapatinServisKompiler } from "./TemplateBahasaProgram";

export async function ApakahSudahMasuk(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, {});
    if(!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },        
        }
    }

    connectDb();

    const Akun = await DataModel.AkunModel.findOne({ email: session.user!.email }) as IAkun | null;

    if(!Akun) {
        deleteCookie("next-auth.session-token", { req, res });
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    return {
        props: {
            Akun: {
                id: Akun._id.toString(),
                username: Akun?.username,
                email: Akun?.email,
                gambar: Akun?.gambar,
                nama: Akun?.nama,
                bio: Akun?.bio,
                tinggal: Akun?.tinggal,
                website: Akun?.website,
                admin: Akun?.admin,
                moderator: Akun?.moderator
            }
        }
    }
}

export async function JalaninKompiler(DataKompiler: KeperluanKompiler) {
    const { buat, kode, idsoal, w: StatusJawaban, bahasa } = DataKompiler;

    const InfoKompiler = DapatinServisKompiler(bahasa, kode);
    if(InfoKompiler.NamaKompiler === "Tidak Ada") return 404;

    let HasilGabunganKode;
    if(buat) {
        if(buat[bahasa] === undefined || buat[bahasa].listjawaban === undefined) return 403;
        
        HasilGabunganKode = InfoKompiler.GabunganKode + '\n' + buat[bahasa].listjawaban;
    } else {
        // const DataSoal = await prisma.soal.findUnique({
        //     where: {
        //         id: idsoal
        //     },
        //     include: {
        //         kumpulanjawaban: {
        //             where: {
        //                 bahasa: bahasa
        //             }
        //         }
        //     }
        // });
        const DataSoal = await DataModel.SoalModel.findOne({
            _id: idsoal
        }) as ISoal || null;
    
        if(DataSoal === null || StatusJawaban === undefined) return 404;
        // HasilGabunganKode = 'import json\n' + kode + '\n' + InfoKompiler.FungsiApakahSama + '\n' + (StatusJawaban === "jawaban" ? DataSoal.listjawaban : DataSoal.contohjawaban);
        HasilGabunganKode = InfoKompiler.GabunganKode + '\n' + (StatusJawaban === "jawaban" ? DataSoal.BahasaSoal[0].listjawaban : DataSoal.BahasaSoal[0].contohjawaban);
    }

    if(bahasa === "javascript") {
        HasilGabunganKode += '\n' + 'console.timeEnd("waktu");';
    } else if(bahasa === "lua") {
        HasilGabunganKode += '\n' + 'print("waktu: "..os.clock() - waktu);'
    }
    
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
            
            if(data.stderr.length > 0) {
                // console.log(data.stderr);
                return { error: data.stderr.map((v) => v.text + '\n').toString() };
            }
            
            let lastindex = 0;
            const ParseOutput: TipeKonfirmasiJawaban[] = data.stdout.filter((v) => v.text.includes("SplitIniUntukTestCase")).map((v, i) => {
                const ind = data.stdout.findIndex((d) => d === v);
                const hasilprint = data.stdout.slice(lastindex, ind);
                lastindex = ind + 1;
                const DataPrint = hasilprint.map((d) => d.text);

                return {...JSON.parse(v.text.replace("SplitIniUntukTestCase", "")), print: DataPrint.length <= 0 ? undefined : DataPrint}
            })
            
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

        let OutputData: { print: string, hasil: string }[] = [];
        let PrintConsole = "";
        for(const v of data.program_output.split("\n")) {
            if(v.includes("SplitIniUntukTestCase")) {
                OutputData.push({ print: PrintConsole, hasil: v.replace("SplitIniUntukTestCase", "") });
                PrintConsole = "";
                continue;
            }
    
            PrintConsole += v;
        }

        // const ParseOutput: TipeKonfirmasiJawaban[] = data.program_output.split('\n').filter((v) => !v.includes("waktu") && v !== "").map((v) => JSON.parse(v.replace("SplitIniUntukTestCase", "")));
        const ParseOutput: TipeKonfirmasiJawaban[] = OutputData.map((v) => ({ ...JSON.parse(v.hasil), print: v.print })) as any;
        
        return { 
            data: ParseOutput,
            waktu: data.program_output.split('\n').filter((v) => v.includes("waktu"))[0].split(' ')[1].replace('ms', "").split('.')[1].replace('0', ""),
            lulus: ParseOutput.filter((v) => v.hasil === v.jawaban).length,
            gagal: ParseOutput.filter((v) => v.hasil !== v.jawaban).length
        };
    } catch(e) {
        return 500;
    }
}

export const SemenjakWaktu = (date: Date) => {
    var seconds = Math.floor((new Date() as any - (date as any)) / 1000);

    let interval = seconds / 31536000;

    if (interval >= 1) {
        return Math.floor(interval) + " tahun lalu";
    }
    interval = seconds / 2592000;
    if (interval >= 1) {
        return Math.floor(interval) + " bulan lalu";
    }
    interval = seconds / 86400;
    if (interval >= 1) {
        return Math.floor(interval) + " hari lalu";
    }
    interval = seconds / 3600;
    if (interval >= 1) {
        return Math.floor(interval) + " jam lalu";
    }
    interval = seconds / 60;
    if (interval >= 1) {
        return Math.floor(interval) + " menit lalu";
    }
    return Math.floor(seconds) + " detik lalu";
}

export const KirimNotifikasi = (status: WarnaStatus, pesan: string, { req, res }: { req: NextApiRequest, res: NextApiResponse }): void => {
    setCookie('notif', { status, pesan }, { maxAge: 3, req, res });
}