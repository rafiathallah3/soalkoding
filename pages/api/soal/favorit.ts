import type { NextApiRequest, NextApiResponse } from 'next';
import { verify } from '../../../services/jwt_sign';
import { DapatinSQL, parseCookies } from '../../../database/db';
import { decrypt } from '../../../database/UbahKeHash';
import Verifikasi from '../../../services/VerifikasiAkun';
import { prisma } from '../../../database/prisma';

export default async function Favorit(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error: ${verifikasi}`);

        const { idsoal } = req.body;

        const DapatinSoal = await prisma.soal.findUnique({
            where: {
                id: idsoal
            }
        });

        if(DapatinSoal === null) return res.status(404).send("Soal tidak ketemu");

        const UpdateData = await prisma.soal.update({
            where: {
                id: idsoal
            },
            data: {
                suka: JSON.stringify(JSON.parse(DapatinSoal.suka).includes(verifikasi) ? JSON.parse(DapatinSoal.suka).filter((v: any) => v !== verifikasi) : JSON.parse(DapatinSoal.suka).concat([verifikasi]))
            }
        });

        return res.json({ suka_ngk: JSON.parse(UpdateData.suka).includes(verifikasi), berapa: JSON.parse(UpdateData.suka).length });
        // const DataKue: { infoakun: string } = parseCookies(req);
        // if(Object.keys(DataKue).length <= 0) {
        //     return res.redirect(401, "Unautherized");
        // }

        // const Infoomasi = await verify(DataKue.infoakun, process.env.SECRET!) as { datanya: {iv: string, IniDataRahasia: string} };
        // const HasilDecrypt: {username: string} = JSON.parse(decrypt(Infoomasi.datanya));

        // const { idsoal } = req.body;
        // let DapatinUser = (await DapatinSQL('SELECT id FROM users WHERE username = ?', [HasilDecrypt.username]) as any[])[0] as { id: number };
        // let DapatinSukaSoal = JSON.parse((await DapatinSQL('SELECT suka FROM soal WHERE idsoal = ?', [idsoal]) as any[])[0].suka) as number[];
        
        // let HasilData = !DapatinSukaSoal.includes(DapatinUser.id) ? DapatinSukaSoal.concat([DapatinUser.id]) : DapatinSukaSoal.filter((v) => v !== DapatinUser.id);
        // await DapatinSQL('UPDATE soal SET suka = ? WHERE idsoal = ?', [JSON.stringify(HasilData), idsoal]);

        // res.status(200).json({suka_ngk: HasilData.includes(DapatinUser.id), berapa: HasilData.length});
    } else {
        res.redirect(405, 'Method tidak boleh');
    }
}