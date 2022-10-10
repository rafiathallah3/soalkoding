export interface HasilJawaban {
    koreksi: boolean,
    status: "Sukses" | "Error",
    hasil: any,
    jawaban: any
}

export interface DataProfile {
    id: number,
    username: string,
    nama: string,
    soalselesai: { namasoal: string, url: string, level: number, kapan: number }[],
    bikin: string,
    bio: string,
    tinggal: string,
    githuburl: string
}

export interface DataSoal {
    namasoal: string,
    level: number,
    tags: string,
    soal: string,
    idsoal: string,
    pembuat: string,
    public: number,
    suka: string
}

export interface Solusi {
    idsoal: string,
    idsolusi: string,
    username: string,
    pintar: string,
    komentar: string,
    kode: string,
    bikin: string,
    bahasa: string,
    id: string
}

export interface Komentar {
    id: number,
    idsoal: string,
    komen: string,
    username: string,
    bikin: string,
    upvote: string,
    downvote: string
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
        pembuat: string,
        suka: string,
    }
}