import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { decrypt } from "../database/UbahKeHash";
import jwt from 'jsonwebtoken';

export default function Verifikasi(req: NextApiRequest, res: NextApiResponse): number | string {
    const DapatinKueAkun = getCookie('infoakun', { req, res });

    if(DapatinKueAkun === undefined) return 401
    let VerifikasiAkun;
    try {
        VerifikasiAkun = jwt.verify(DapatinKueAkun as string, process.env.TOKENRAHASIA!);
    } catch {
        return 403
    }

    const Infoomasi: { id: string } = JSON.parse(decrypt((jwt.decode(DapatinKueAkun as string) as any).datanya));
    return Infoomasi.id;
}