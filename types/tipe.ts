export interface IAkun {
    _id: string,
    email: string,
    username: string,
    password: string,
    nama: string,
    bio: string
    tinggal: string,
    website: string,
    githuburl: string,
    gambar: string,
    soalselesai: ISolusi[],
    favorit: IFavorit[],
    MasukDenganGithub: boolean,
    admin: boolean,
    moderator: boolean,
    createdAt: Date,
}

export interface ISoal {
    _id: string,
    createdAt: string,
    updatedAt: string,
    namasoal: string,
    level: number,
    tags: string[],
    soal: string,
    pembuat: IAkun,
    public: boolean,
    favorit: IFavorit[],
    diskusi: IDiskusi[]
    bikin: Date,
    BahasaSoal: TipeInfoKode[],
    solusi: ISolusi[],
}

export interface IDiskusi {
    _id: string,
    createdAt: string,
    updatedAt: string,
    soal: ISoal,
    user: IAkun,
    text: string,
    upvote: string[],
    downvote: string[],
}

export interface ISolusi {
    _id: string,
    createdAt: string,
    updatedAt: string,
    soal: ISoal,
    user: IAkun,
    pintar: string[],
    diskusi: IDiskusi[],
    kode: string,
    bahasa: string,
}

export interface IFavorit {
    user: IAkun,
    soal: ISoal
}

export interface Notifikasi {
    id: number,
    userDari: { username: string, gambarurl: string },
    userKirim: { username: string, gambarurl: string },
    konten: string,
    link: string,
    tipe: string,
    bikin: string,
}

export interface TipeProfile {
    username: string,
    gambar: string,
    admin: boolean,
    moderator: boolean,
    notifikasi: Notifikasi[],
    jumlahNotif: number
}

export interface KeperluanKompiler {
    buat?: { [bahasa: string]: TipeInfoKode },
    idsoal?: string,
    w?: string,
    kode: string,
    bahasa: string,
}

export interface DataSoal {
    suka_ngk: boolean,
    ApakahSudahSelesai: boolean,
    soal: ISoal
}

export interface TipeInfoKode {
    contohjawaban: string,
    listjawaban: string,
    liatankode: string,
    jawabankode: string,
    bahasa: string
}

export interface TipeKonfirmasiJawaban {
    hasil: any
    jawaban: any
    koreksi: boolean
    status: "Sukses" | "Error"
    error?: string
    print?: string[]
}

export interface HasilKompiler {
    data: TipeKonfirmasiJawaban[]
    waktu: string | number,
    lulus: number,
    gagal: number,
    error?: any,
    statuskompiler: "Sukses" | "Mengirim" | "", //Ini untuk menunjukkan kalau user mengirim kompiler dan tunjukkin hasil kompiler kalau sudah selesai 20:31 29/10/2022
}

export interface OutputCompilerGodbolt {
    stdout: { text: string }[],
    stderr: { text: string }[],
    execTime: string
}

export interface OutputCompilerWandbox {
    program_output: string,
    program_error: string,
    status: "0" | "1"
}

export interface TipeNotifikasi {
    status: WarnaStatus,
    pesan: string
}

export type KumpulanBahasaProgram = "python" | "javascript" | "c++" | "lua";

export enum WarnaStatus {
    kuning = "warning",
    biru = "info",
    merah = "error"
}

export enum WarnaAkun {
    admin = "#00b8ff",
    moderator = "#c21faf"
}