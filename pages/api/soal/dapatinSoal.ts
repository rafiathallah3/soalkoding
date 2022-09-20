import { NextApiRequest, NextApiResponse } from "next";
import { DapatinSQL } from "../../../database/db";

export default async function dapatinSoal(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        console.log("Yes");
        const { idsoal } = req.body;
        const data = await DapatinSQL('SELECT * FROM soal WHERE idsoal = ?', [idsoal])

        res.json(data)
    }
}