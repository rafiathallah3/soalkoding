import type { NextApiRequest, NextApiResponse } from 'next';

export default async function KirimJawaban(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        return res.json({pesan: "minecraft"})
    }

    return res.redirect(405, 'Method not allowed');
}