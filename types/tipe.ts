export interface HasilJawaban {
    koreksi: boolean,
    status: "Sukses" | "Error",
    hasil: any,
    jawaban: any
}

export interface SettingProfile {
    email: string,
    username: string,
    nama: string,
    bio: string
    tinggal: string,
    akungithub?: { username: string },
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
    kumpulanjawaban: {
        bahasa: string,
        listjawaban: string,
        contohjawaban: string,
        liatankode: string,
        jawabankode: string
    }[]
}

export interface Solusi {
    id: string
    idsoal: string,
    user: { username: string },
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
    user: { username: string },
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
}

export interface HasilKompiler {
    data: TipeKonfirmasiJawaban[]
    waktu: string | number,
    lulus: number,
    gagal: number,
    error?: any,
    statuskompiler: "Sukses" | "Mengirim" | "" //Ini untuk menunjukkan kalau user mengirim kompiler dan tunjukkin hasil kompiler kalau sudah selesai 20:31 29/10/2022
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
    biru = "blue",
    merah = "red"
}