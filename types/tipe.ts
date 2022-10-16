export interface HasilJawaban {
    koreksi: boolean,
    status: "Sukses" | "Error",
    hasil: any,
    jawaban: any
}

export interface SettingProfile {
    email: string,
    username: string,
    name: string,
    bio: string
    tinggal: string,
    githuburl: string,
    website: string,
}

export interface DataProfile {
    username: string,
    nama: string,
    soalselesai: { id: string, soal: { id: string, namasoal: string, level: number }, kapan: Date }[],
    bikin: string,
    bio: string,
    tinggal: string,
    githuburl: string,
    website: string
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
    idsoal: string,
    suka_ngk: boolean,
    JumlahSolusi: number,
    solusi: (Solusi & { apakahSudahPintar: boolean })[],
    soal: {
        namasoal: string,
        level: number,
        tags: string,
        pembuat: { username: string },
        suka: string,
    }
}