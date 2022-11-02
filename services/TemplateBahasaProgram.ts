const PythonGabunganKode = `
import json
%s
def ApakahSama(fungsi, parameter, jawaban):
    try:
        hasil = fungsi(*parameter)
        print(json.dumps({"hasil": f"{hasil}", "jawaban": f"{jawaban}", "status": "Sukses", "koreksi": jawaban == hasil}))
    except Exception as e:
        import base64
        print(json.dumps({"hasil": str(e), "jawaban": jawaban, "status": "Error"}))
`.trim();

const JavascriptGabungaKode = `
%s
function ApakahSama(fungsi, parameter, jawaban) {
    try {
        hasil = fungsi(...parameter);
        console.log(JSON.stringify({hasil, jawaban, status: "Sukses", koreksi: jawaban === hasil}));
    } catch (e) {
        console.log(JSON.stringify({hasil: e.toString(), jawaban, status: "Error"}));
    }
}
console.time("waktu");
`.trim();

const PythonContohSoal = {
Kode: `
def Solusi(angka1, angka2):
    return angka1 + angka2
`.trim(),
ListJawaban: `
ApakahSama(Solusi, [1, 1], 2)
ApakahSama(Solusi, [2, 2], 4)
ApakahSama(Solusi, [3, 3], 6)
`.trim(),
ContohJawaban: `
ApakahSama(Solusi, [1, 1], 2)
ApakahSama(Solusi, [2, 2], 4)
`.trim(),
LiatanKode: `
def Solusi(angka1, angka2):
    ...
`.trim(),
Soal: `
Jumlahin angka yang sudah diberikan!

Contoh
~~~python
Solusi(1, 1) # 1 + 1 -> 2;
Solusi(2, 2) # 2 + 2 -> 4;
~~~
`.trim(),
}

const JavascriptContohSoal = {
Kode: `
function Solusi(angka1, angka2) {
    return angka1 + angka2;
}
`.trim(),
ListJawaban: `
ApakahSama(Solusi, [1, 1], 2);
ApakahSama(Solusi, [2, 2], 4);
ApakahSama(Solusi, [3, 3], 6);
`.trim(),
ContohJawaban: `
ApakahSama(Solusi, [1, 1], 2);
ApakahSama(Solusi, [2, 2], 4);
`.trim(),
LiatanKode: `
function Solusi(angka1, angka2) {

}
`.trim(),
Soal: `
Jumlahin angka yang sudah diberikan!

Contoh
~~~javascript
Solusi(1, 1) // 1 + 1 -> 2;
Solusi(2, 2) // 2 + 2 -> 4;
~~~
`.trim()
}

const KompilerWandbox = {
    javascript: "nodejs-16.14.0",
}

const KompilerGodbolt = {
    python: "python310"
}

const KumpulanFungsi = {
    python: PythonGabunganKode,
    javascript: JavascriptGabungaKode,
}

const ContohSoal = {
    python: PythonContohSoal,
    javascript: JavascriptContohSoal
}

function parse(str: string, ...argumen: any[]) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}

export function DapatinServisKompiler(bahasa: string, kode: string): { NamaKompiler: "Wandbox" | "Godbolt" | "Tidak Ada", Kompiler: string, GabunganKode: string } {
    if(bahasa === undefined || kode === undefined) return {NamaKompiler: "Tidak Ada", Kompiler: "", GabunganKode: ""};
    
    const ApakahKompilerWandbox = Object.keys(KompilerWandbox).includes(bahasa);
    const ApakahKompilerGodbolt = Object.keys(KompilerGodbolt).includes(bahasa);
    if(ApakahKompilerWandbox || ApakahKompilerGodbolt) {
        return {
            NamaKompiler: ApakahKompilerWandbox ? "Wandbox" : "Godbolt",
            Kompiler: ApakahKompilerWandbox ? KompilerWandbox[bahasa as keyof typeof KompilerWandbox] : KompilerGodbolt[bahasa as keyof typeof KompilerGodbolt],
            GabunganKode: parse(KumpulanFungsi[bahasa as keyof typeof KumpulanFungsi], kode)
        }
    }

    return {NamaKompiler: "Tidak Ada", Kompiler: "", GabunganKode: ""};
}

export function DapatinContohSoal(bahasa: string) {
    return ContohSoal[bahasa as keyof typeof ContohSoal]
}