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
    html_url: string
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