import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../database/prisma";
import Verifikasi from "../../../../services/VerifikasiAkun";

export default async function hapusSolusi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(401);

        const { idsolusi } = req.body;

        const DataSolusi = await prisma.solusi.findFirst({
            where: {
                id: idsolusi,
            }
        });

        if(DataSolusi === null) return res.send("Dihapus!");

        if(DataUser.moderator || DataUser.admin || DataSolusi.idusername === verifikasi) {
            await prisma.solusi.delete({
                where: {
                    id: DataSolusi.id
                }
            });
        }

        return res.status(200).send("Sukses di hapus!");
    }

    return res.status(405).send("Error 405");
}