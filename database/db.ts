import { createConnection } from 'mysql2/promise';

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