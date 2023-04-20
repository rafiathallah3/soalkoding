const PythonGabunganKode = `
import json
%s
def ApakahSama(fungsi, parameter, jawaban):
    try:
        hasil = fungsi(*parameter)
        print(f"""SplitIniUntukTestCase{json.dumps({"hasil": f"{hasil}", "jawaban": f"{jawaban}", "status": "Sukses", "koreksi": jawaban == hasil})}""")
    except Exception as e:
        import base64
        print(f"""SplitIniUntukTestCase{json.dumps({"hasil": str(e), "jawaban": jawaban, "status": "Error"})}""")
`.trim();

const JavascriptGabungaKode = `
%s
function ApakahSama(fungsi, parameter, jawaban) {
    try {
        const hasil = fungsi(...parameter);
        console.log("SplitIniUntukTestCase"+JSON.stringify({hasil, jawaban, status: "Sukses", koreksi: jawaban === hasil}));
    } catch (e) {
        console.log("SplitIniUntukTestCase"+JSON.stringify({hasil: e.toString(), jawaban, status: "Error"}));
    }
}
console.time("waktu");
`.trim();

const LuaGabunganKode = `
%s
function ApakahSama(fungsi, parameter, jawaban) 
    local success, err = pcall(fungsi, table.unpack(parameter));
    if success then
        local hasil = fungsi(table.unpack(parameter));
        print('{"hasil": '..hasil..', "jawaban": '..jawaban..', "status": "Sukses", "koreksi": '..tostring(jawaban==hasil)..'}');
    else
        print('{"hasil": '..err..', "jawaban": '..jawaban..', status: "Error"'..'}');
    end
end
local waktu = os.clock();
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
}

const LuaContohSoal = {
Kode: `
function Solusi(angka1, angka2)
    return angka1 + angka2;
end
`.trim(),
ListJawaban: `
ApakahSama(Solusi, {1, 1}, 2);
ApakahSama(Solusi, {2, 2}, 4);
ApakahSama(Solusi, {3, 3}, 6);
`.trim(),
ContohJawaban: `
ApakahSama(Solusi, {1, 1}, 2);
ApakahSama(Solusi, {2, 2}, 4);
`.trim(),
LiatanKode: `
function Solusi(angka1, angka2)
end
`.trim(),
}

const KompilerWandbox = {
    javascript: "nodejs-16.14.0",
    lua: "lua-5.4.3"
}

const KompilerGodbolt = {
    python: "python310"
}

const KumpulanFungsi = {
    python: PythonGabunganKode,
    javascript: JavascriptGabungaKode,
    lua: LuaGabunganKode
}

const ContohSoal = {
    python: PythonContohSoal,
    javascript: JavascriptContohSoal,
    lua: LuaContohSoal
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

export const DapatinSemuaBahasa = () => Object.keys(ContohSoal);