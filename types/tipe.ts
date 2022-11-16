export interface SettingProfile {
    email: string,
    username: string,
    nama: string,
    bio: string
    tinggal: string,
    admin: boolean,
    moderator: boolean,
    akungithub?: { username: string },
    favorit: { id: number, soal: DataSoal }[]
    githuburl: string,
    sudahVerifikasi: boolean,
    gambarurl: string,
    website: string,
    bikin: string
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

export interface DataProfile extends SettingProfile {
    soalselesai: { id: string, soal: { id: string, namasoal: string, level: number }, kapan: Date, bahasa: string }[],
}

export interface DataSoal {
    namasoal: string,
    level: number,
    tags: string,
    soal: string,
    id: string,
    pembuat: { username: string },
    public: boolean,
    suka: string,
    favorit: { id: number }[],
    diskusi: Diskusi[]
    bikin: Date,
    kumpulanjawaban: {
        bahasa: string,
        listjawaban: string,
        contohjawaban: string,
        liatankode: string,
        jawabankode: string
    }[],
    solusi: Solusi[],
    ApakahSudahSelesai: boolean,
    suka_ngk: boolean
}

export interface Diskusi {
    id: number,
    user: { username: string, gambarurl: string },
    text: string,
    bikin: Date,
    upvote: string,
    downvote: string,
    apakahSudahVote?: "up" | "down" | "biasa"
}

export interface TipeProfile {
    username: string,
    gambar: string,
    admin: boolean,
    moderator: boolean
}

export interface Solusi {
    id: string
    idsoal: string,
    user: { username: string, admin: boolean, moderator: boolean },
    pintar: string,
    komentar: Komentar[],
    kode: string,
    kapan: string,
    bahasa: string,
    apakahSudahPintar: boolean
}

export interface Komentar {
    id: number,
    idsoal: string,
    komen: string,
    user: { username: string, gambarurl: string },
    bikin: Date,
    upvote: string,
    downvote: string,
    apakahSudahVote?: string
}

export interface DataSolusi {
    profile: string,
    idsoal: string,
    idsolusi: string,
    suka_ngk: boolean,
    ApakahSudahSelesai: boolean,
    JumlahSolusi: number,
    solusi: Solusi[],
    soal: {
        namasoal: string,
        level: number,
        tags: string,
        pembuat: { username: string },
        suka: string,
        favorit: { id: string }[]
    }
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

export type KumpulanBahasaProgram = "python" | "javascript" | "c++" | "lua";

export enum WarnaStatus {
    kuning = "#9ba308",
    biru = "#7AC5CD",
    merah = "#F5646B"
}