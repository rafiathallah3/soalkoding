export interface HasilJawaban {
    koreksi: boolean,
    status: "Sukses" | "Error",
    hasil: any,
    jawaban: any
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
    username: string,
    pintar: string,
    komentar: string,
    kode: string,
    bikin: string,
    bahasa: string,
    id: string
}

export interface DataSolusi {
    idsoal: string,
    suka_ngk: boolean,
    solusi: (Solusi & { apakahSudahPintar: boolean })[],
    soal: {
        namasoal: string,
        level: number,
        tags: string,
        pembuat: string,
        suka: string,
    }
}