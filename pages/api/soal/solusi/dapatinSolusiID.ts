import { NextApiRequest, NextApiResponse } from "next";
import { verify } from '../../../../services/jwt_sign';
import { DapatinSQL, parseCookies } from "../../../../database/db";
import { decrypt } from "../../../../database/UbahKeHash";
import { Solusi } from "../../../../types/tipe";

export default async function dapatinSolusi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const DataKue: { infoakun: string } = parseCookies(req);
        if(Object.keys(DataKue).length <= 0) {
            return res.redirect(401, "Unautherized");
        }

        const Infoomasi = await verify(DataKue.infoakun, process.env.SECRET!) as { datanya: {iv: string, IniDataRahasia: string} };
        const HasilDecrypt: {username: string} = JSON.parse(decrypt(Infoomasi.datanya));

        const { idsolusi } = req.body;
        const dataUser = (await DapatinSQL('SELECT id FROM users WHERE username = ?', [HasilDecrypt.username]) as any[])[0];
        const dataSolusi = (await DapatinSQL('SELECT * FROM solusi WHERE idsolusi = ?', [idsolusi]) as Solusi[]);

        if(dataSolusi.length <= 0) {
            return res.redirect(200, 'Id solusi tidak ditemukan');
        }

        res.json({
            apakahSudahPintar: JSON.parse(dataSolusi[0].pintar).includes(dataUser.id),
            ...dataSolusi[0]
        })
        

    } else {
        res.redirect(405, "Method tidak boleh");
    }
}