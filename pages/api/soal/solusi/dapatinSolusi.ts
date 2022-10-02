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

        const { idsoal } = req.body;
        const dataUser = (await DapatinSQL('SELECT id FROM users WHERE username = ?', [HasilDecrypt.username]) as any[])[0];
        const dataSolusi = await DapatinSQL('SELECT * FROM solusi WHERE idsoal = ?', [idsoal]) as Solusi[];
        const dataSoal = (await DapatinSQL('SELECT namasoal, level, tags, pembuat, suka FROM soal WHERE idsoal = ?', [idsoal]) as any[])[0];

        if(dataSoal.length <= 0) {
            return res.status(404);
        }
        
        res.json({
            idsoal,
            suka_ngk: JSON.parse(dataSoal.suka).includes(dataUser.id),
            solusi: dataSolusi.map((v) => {
                return {
                    ...v,
                    apakahSudahPintar: JSON.parse(v.pintar).includes(dataUser.id)
                }
            }),
            soal: dataSoal
        })
    } else {
        res.redirect(405, "Method Tidak boleh")
    }
}