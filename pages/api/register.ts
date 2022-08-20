import { NextApiRequest, NextApiResponse } from "next";
import { createConnection } from 'mysql2/promise';

export default async function Register(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const db = await createConnection({
            host: "localhost",
            user: "root",
            database: "soalkoding"
        })
    } 
}