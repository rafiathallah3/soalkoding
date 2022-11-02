import { NextApiRequest, NextApiResponse } from "next";
import Verifikasi from "../../../../services/VerifikasiAkun";
import { prisma } from "../../../../database/prisma";
import { TipeInfoKode, WarnaStatus } from "../../../../types/tipe";
import { KirimNotifikasi } from "../../../../services/Servis";

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

        for(const i of Object.values(ParseInfoKode)) {
            if(i.contohjawaban.trim() === "" || i.listjawaban.trim() === "") continue;
            await prisma.soal.update({
                where: {
                    id: idsoal
                },
                data: {
                    kumpulanjawaban: {
                        update:{ 
                            where: {
                                bahasa: i.bahasa
                            },
                            data: {
                                contohjawaban: i.contohjawaban,
                                listjawaban: i.listjawaban,
                                liatankode: i.liatankode,
                                jawabankode: i.jawabankode
                            }
                        }
                    }
                }
            });
        }
    }

    KirimNotifikasi(WarnaStatus.biru, "Update soal berhasil!", {req, res});
    return res.send("Sudah update!");
}