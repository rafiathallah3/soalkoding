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
    soalselesai: { id: string, soal: ISoal, kapan: Date, bahasa: string }[],
    favorit: { id: string, namasoal: string }[],
    MasukDenganGithub: boolean,
    admin: boolean,
    moderator: boolean,
    createdAt: Date,
}

export interface ISoal {
    namasoal: string,
    level: number,
    tags: string[],
    soal: string,
    _id: string,
    pembuat: TipeProfile,
    public: boolean,
    favorit: { id: number }[],
    diskusi: Diskusi[]
    bikin: Date,
    BahasaSoal: {
        bahasa: string,
        listjawaban: string,
        contohjawaban: string,
        liatankode: string,
        jawabankode: string
    }[],
    solusi: ISolusi[],
    ApakahSudahSelesai: boolean,
    suka_ngk: boolean
}

export interface ISolusi {
    idsoal: string,
    user: { username: string, admin: boolean, moderator: boolean },
    pintar: string[],
    komentar: IKomentar[],
    kode: string,
    bahasa: string,
}

export interface IKomentar {
    komen: string,
    user: { username: string, gambarurl: string },
    upvote: string[],
    downvote: string[],
}

export interface APIProfileGithub {
    login: string,
    name: string,
    avatar_url: string,
    location: string,
    bio: string,
    html_url: string,
}

export interface APIEmailsGithub {
    email: string,
    primary: boolean
}

export interface Diskusi {
    id: number,
    user: TipeProfile & { gambarurl: string },
    text: string,
    bikin: Date,
    upvote: string,
    downvote: string,
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
    buat?: string,
    idsoal?: string,
    w?: string,
    kode: string,
    bahasa: string,
}

export interface DataSolusi {
    profile: string,
    idsoal: string,
    idsolusi: string,
    suka_ngk: boolean,
    ApakahSudahSelesai: boolean,
    JumlahSolusi: number,
    solusi: ISolusi[],
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