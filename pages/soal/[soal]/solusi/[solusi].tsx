import axios from "axios";
import { NextApiRequest } from "next";
import { DataSolusi } from "../../../../types/tipe";

export async function getServerSideProps(konteks: { params: { soal: string, solusi: string }, req: NextApiRequest }) {
    const data = await axios.post(`http://${konteks.req.headers.host}/api/soal/solusi/dapatinSolusiID`, {
        idsolusi: konteks.params.solusi
    }, {
        headers: { cookie: konteks.req.headers.cookie } as any
    }).then(d => d.data);

    return {
        props: {
            data
        }
    }
}

export default function Solusi({ data }: { data: DataSolusi }) {
    return (
        <div>
            
        </div>
    )
}