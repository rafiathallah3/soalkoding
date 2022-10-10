import type { NextApiRequest, NextApiResponse } from 'next';
import { verify } from '../../../services/jwt_sign';
import { DapatinSQL, parseCookies } from '../../../database/db';
import { decrypt } from '../../../database/UbahKeHash';

export default async function KirimSolusi(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const DataKue: { infoakun: string } = parseCookies(req);
        if(Object.keys(DataKue).length <= 0) {
            return res.redirect(401, "Unautherized");
        }

        const Infoomasi = await verify(DataKue.infoakun, process.env.SECRET!) as { datanya: {iv: string, IniDataRahasia: string} };
        const HasilDecrypt: {email: string, username: string} = JSON.parse(decrypt(Infoomasi.datanya));

        const { kode, idsoal } = req.body;
        const tanggal = new Date();

        const dataUser = (await DapatinSQL('SELECT soalselesai FROM users WHERE username = ?', [HasilDecrypt.username]) as any[])[0];
        await DapatinSQL('INSERT INTO solusi (idsoal, username, pintar, komentar, kode, bikin) VALUES (?, ?, ?, ?, ?, ?)', [idsoal, HasilDecrypt.username, 0, '[]', kode, tanggal.toDateString()])
        
        if(!JSON.parse(dataUser.soalselesai).includes(idsoal)) {
            await DapatinSQL('UDPATE users SET soalselesai = ? WHERE username = ?', [JSON.parse(dataUser.soalselesai).concat([idsoal]), HasilDecrypt.username]);
        }
        res.redirect(200, 'sukses');
    } else {
        res.redirect(405, 'Method tidak boleh');
    }
}