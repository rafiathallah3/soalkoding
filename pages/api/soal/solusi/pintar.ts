import type { NextApiRequest, NextApiResponse } from 'next';
import { verify } from '../../../../services/jwt_sign';
import { DapatinSQL, parseCookies } from '../../../../database/db';
import { decrypt } from '../../../../database/UbahKeHash';
import { prisma } from '../../../../database/prisma';
import Verifikasi from '../../../../services/VerifikasiAkun';

export default async function Pintar(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);
        
        const { idsoal, idsolusi } = req.body;
 
        const DapatinUser = await prisma.akun.findUnique({
            where: {
                id: verifikasi
            }
        });
        const DapatinPintarSolusi = await prisma.solusi.findUnique({
            where: {
                id: idsolusi
            },
            select: {
                pintar: true
            }
        });

        if(DapatinPintarSolusi === null) return res.status(404).send("Tidak ada");

        const HasilData = !JSON.parse(DapatinPintarSolusi.pintar).includes(verifikasi) ? JSON.parse(DapatinPintarSolusi.pintar).concat([verifikasi]) : JSON.parse(DapatinPintarSolusi.pintar).filter((v: any) => v !== verifikasi);

        await prisma.solusi.update({
            where: {
                id: idsolusi
            },
            data: {
                pintar: JSON.stringify(HasilData)
            }
        })
        // const DataKue: { infoakun: string } = parseCookies(req);
        // if(Object.keys(DataKue).length <= 0) {
        //     return res.redirect(401, "Unautherized");
        // }

        // const Infoomasi = await verify(DataKue.infoakun, process.env.SECRET!) as { datanya: {iv: string, IniDataRahasia: string} };
        // const HasilDecrypt: {username: string} = JSON.parse(decrypt(Infoomasi.datanya));

        // let DapatinUser = (await DapatinSQL('SELECT id FROM users WHERE username = ?', [HasilDecrypt.username]) as any[])[0] as { id: number };
        // let DapatinPintarSolusi = JSON.parse((await DapatinSQL('SELECT pintar FROM solusi WHERE id = ? AND idsoal = ?', [idsolusi, idsoal]) as any[])[0].pintar) as number[];

        // let HasilData = !DapatinPintarSolusi.includes(DapatinUser.id) ? DapatinPintarSolusi.concat([DapatinUser.id]) : DapatinPintarSolusi.filter((v) => v !== DapatinUser.id);
        // await DapatinSQL('UPDATE solusi SET pintar = ? WHERE idsoal = ?', [JSON.stringify(HasilData), idsoal]);

        res.status(200).json({suka_ngk: HasilData.includes(verifikasi), berapa: HasilData.length, idsolusi});
    } else {
        res.redirect(405, 'Method tidak boleh');
    }
}