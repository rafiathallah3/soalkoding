import { NextApiRequest, NextApiResponse } from "next";
import { getCookie, setCookie } from "cookies-next";
import BuatKomponen from "../../components/BuatSoal";
import axios from "axios";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const infoakun = getCookie('infoakun', { req, res }) as string;
    if (infoakun === undefined) return { redirect: { destination: '/login', permanent: false } };

    const DapatinToken = await axios.post("http://localhost:3003/api/dapatintokenbaru", {}, {
        headers: { cookie: req.headers.cookie } as any
    }).then(d => d.data);

    setCookie('infoakun', DapatinToken, {
        req, res,
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
    });

    return {
        props: {}
    }
}

export default function Buat() {
    return (
        <BuatKomponen
            mode="buat"
        />
    )
}