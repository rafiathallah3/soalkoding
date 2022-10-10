import { NextApiRequest, NextApiResponse } from "next";
import { verify } from '../../../services/jwt_sign';
import { DapatinSQL, parseCookies } from "../../../database/db";
import { decrypt } from "../../../database/UbahKeHash";
import { DataSoal } from "../../../types/tipe";

export default async function dapatinSoal(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const DataKue: { infoakun: string } = parseCookies(req);
        if(Object.keys(DataKue).length <= 0) {
            return res.redirect(401, "Unautherized");
        }

        const Infoomasi = await verify(DataKue.infoakun, process.env.SECRET!) as { datanya: {iv: string, IniDataRahasia: string} };
        const HasilDecrypt: {username: string} = JSON.parse(decrypt(Infoomasi.datanya));
        const dataUser = (await DapatinSQL('SELECT id FROM users WHERE username = ?', [HasilDecrypt.username]) as any[])[0];

        const { idsoal } = req.body;
        const dataSoal = (await DapatinSQL('SELECT * FROM soal WHERE idsoal = ?', [idsoal]) as DataSoal[])[0];

        if(dataSoal === undefined) {
            return res.status(404);
        }

        res.json({
            ...dataSoal,
            suka_ngk: JSON.parse(dataSoal.suka).includes(dataUser.id),
        });
    } else {
        res.status(401);
    }
}