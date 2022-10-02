import type { NextApiRequest, NextApiResponse } from 'next';
import { verify } from '../../../../services/jwt_sign';
import { DapatinSQL, parseCookies } from '../../../../database/db';
import { decrypt } from '../../../../database/UbahKeHash';

export default async function Pintar(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const DataKue: { infoakun: string } = parseCookies(req);
        if(Object.keys(DataKue).length <= 0) {
            return res.redirect(401, "Unautherized");
        }

        const Infoomasi = await verify(DataKue.infoakun, process.env.SECRET!) as { datanya: {iv: string, IniDataRahasia: string} };
        const HasilDecrypt: {username: string} = JSON.parse(decrypt(Infoomasi.datanya));

        const { idsoal, idsolusi } = req.body;
        let DapatinUser = (await DapatinSQL('SELECT id FROM users WHERE username = ?', [HasilDecrypt.username]) as any[])[0] as { id: number };
        let DapatinPintarSolusi = JSON.parse((await DapatinSQL('SELECT pintar FROM solusi WHERE id = ? AND idsoal = ?', [idsolusi, idsoal]) as any[])[0].pintar) as number[];

        let HasilData = !DapatinPintarSolusi.includes(DapatinUser.id) ? DapatinPintarSolusi.concat([DapatinUser.id]) : DapatinPintarSolusi.filter((v) => v !== DapatinUser.id);
        await DapatinSQL('UPDATE solusi SET pintar = ? WHERE idsoal = ?', [JSON.stringify(HasilData), idsoal]);

        res.status(200).json({suka_ngk: HasilData.includes(DapatinUser.id), berapa: HasilData.length, idsolusi});
    } else {
        res.redirect(405, 'Method tidak boleh');
    }
}