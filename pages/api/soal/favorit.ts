import type { NextApiRequest, NextApiResponse } from 'next';
import { verify } from '../../../services/jwt_sign';
import { DapatinSQL, parseCookies } from '../../../database/db';
import { decrypt } from '../../../database/UbahKeHash';

export default async function Favorit(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const DataKue: { infoakun: string } = parseCookies(req);
        if(Object.keys(DataKue).length <= 0) {
            return res.redirect(401, "Unautherized");
        }

        const Infoomasi = await verify(DataKue.infoakun, process.env.SECRET!) as { datanya: {iv: string, IniDataRahasia: string} };
        const HasilDecrypt: {username: string} = JSON.parse(decrypt(Infoomasi.datanya));

        const { idsoal } = req.body;
        let DapatinUser = (await DapatinSQL('SELECT id FROM users WHERE username = ?', [HasilDecrypt.username]) as any[])[0] as { id: number };
        let DapatinSukaSoal = JSON.parse((await DapatinSQL('SELECT suka FROM soal WHERE idsoal = ?', [idsoal]) as any[])[0].suka) as number[];
        
        let HasilData = !DapatinSukaSoal.includes(DapatinUser.id) ? DapatinSukaSoal.concat([DapatinUser.id]) : DapatinSukaSoal.filter((v) => v !== DapatinUser.id);
        await DapatinSQL('UPDATE soal SET suka = ? WHERE idsoal = ?', [JSON.stringify(HasilData), idsoal]);

        res.status(200).json({suka_ngk: HasilData.includes(DapatinUser.id), berapa: HasilData.length});
    } else {
        res.redirect(405, 'Method tidak boleh');
    }
}