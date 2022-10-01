import { createConnection } from 'mysql2/promise';
import { NextApiRequest } from 'next/types';

export async function DapatinSQL(query: string, values: any[] = []) {
    const db = await createConnection({
        host: "localhost",
        user: "root",
        database: "soalkoding"
    });

    try {
        const [ data ] = await db.execute(query, values);
        db.end();
        return data;
    } catch (e: any) {
        return { e };
    }
}

export function parseCookies (request: NextApiRequest) {
    const list: any = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name as keyof typeof list] = decodeURIComponent(value);
    });

    return list;
}