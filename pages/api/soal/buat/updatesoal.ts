import { NextApiRequest, NextApiResponse } from "next";
import Verifikasi from "../../../../services/VerifikasiAkun";
import { prisma } from "../../../../database/prisma";
import { TipeInfoKode, WarnaStatus } from "../../../../types/tipe";
import { JalaninKompiler, KirimNotifikasi } from "../../../../services/Servis";
import { DapatinSemuaBahasa } from "../../../../services/TemplateBahasaProgram";

export default async function UpdateSoal(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const { idsoal, namasoal, level, tags, soal, infokode, publicsoal } = req.body;

        const DataSoal = await prisma.soal.findFirst({
            where: {
                id: idsoal,
                idpembuat: verifikasi
            }
        });

        if(DataSoal === null) return res.status(403).send("Error: 403");
        const ParseInfoKode = JSON.parse(infokode) as { [bahasa: string]: TipeInfoKode };

        if(publicsoal) {
            for(const i of Object.values(ParseInfoKode)) {
                const HasilKompiler = await JalaninKompiler({ buat: JSON.stringify(ParseInfoKode), bahasa: i.bahasa, kode: i.jawabankode });
    
                if(typeof HasilKompiler === "number") 
                    return res.json({ error: `Ada kesalahan saat ngekompile kode jawaban ${i.bahasa}` })
                
                if(HasilKompiler.gagal === 0) {
                    if(i.contohjawaban.trim() === "" || i.listjawaban.trim() === "") continue;

                    const KumpulanJawaban = await prisma.kumpulanJawaban.findFirst({
                        where: {
                            idsoal,
                            bahasa: i.bahasa
                        }
                    });
                    
                    if(KumpulanJawaban === null) {
                        if(!DapatinSemuaBahasa().includes(i.bahasa))
                            return res.status(404).send("Error: 404");

                        await prisma.kumpulanJawaban.create({
                            data: {
                                ...i,
                                idsoal,
                            }
                        });

                        await prisma.solusi.create({
                            data: {
                                bahasa: i.bahasa,
                                kode: i.jawabankode,
                                idsoal,
                                idusername: verifikasi,
                            }
                        })
                    } else {
                        console.time("test");
                        await prisma.kumpulanJawaban.update({
                            where: {
                                id: KumpulanJawaban.id
                            },
                            data: {
                                ...i
                            }
                        });

                        console.log(i);
                        await prisma.solusi.updateMany({
                            where: {
                                idsoal,
                                idusername: verifikasi,
                                bahasa: i.bahasa
                            },
                            data: {
                                kode: i.jawabankode,
                                bahasa: i.bahasa
                            }
                        })
                        console.timeEnd("test");
                    }
                } else {
                    return res.json({ error: `List jawaban dari kode bahasa ${i.bahasa} tidak sesuai dengan jawaban yang ditentukan` })
                }
            }
        }

        await prisma.soal.update({
            where: {
                id: idsoal,
            },
            data: {
                namasoal,
                level: parseInt(level),
                tags,
                soal,
                public: publicsoal
            }
        });

        return res.send("Sukses");
    }

    KirimNotifikasi(WarnaStatus.biru, "Update soal berhasil!", {req, res});
    return res.send("Sudah update!");
}