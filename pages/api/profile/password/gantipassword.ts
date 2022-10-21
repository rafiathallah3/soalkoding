import { NextApiRequest, NextApiResponse } from "next";
import Verifikasi from "../../../../services/VerifikasiAkun";
import bcrypt from 'bcrypt';
import { prisma } from "../../../../database/prisma";

export default async function GantiPassword(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

        const DataUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });

        if(DataUser === null) return res.status(401);

        const { passwordbaru, konfirmasipassword, password } = req.body;
        if(passwordbaru !== konfirmasipassword) return res.send("Password berbeda dengan konfirmasi");

        if(await bcrypt.compare(password, DataUser.password)) {
            await prisma.akun.update({
                where: {
                    id: verifikasi,
                },
                data: {
                    password: await bcrypt.hash(passwordbaru, await bcrypt.genSalt())
                }
            });

            return res.status(200).send("Password sudah berhasil diganti");
        }

        return res.send("Password salah");
    }
    return res.status(405).send("Error 405");
}