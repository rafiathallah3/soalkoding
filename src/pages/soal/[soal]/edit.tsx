import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import BuatKomponen from "../../../../components/BuatSoal";
import { ApakahSudahMasuk } from "../../../../lib/Servis";
import { IAkun, ISoal } from "../../../../types/tipe";
import { DataModel } from "../../../../lib/Model";

export async function getServerSideProps({ params, req, res }: { params: { soal: string }, req: NextApiRequest, res: NextApiResponse }) {
    const session = await ApakahSudahMasuk(req, res);
    if(!session.props) return session 
    
    const DataSoal = await DataModel.SoalModel.findById(params.soal).populate("pembuat").lean() as ISoal || null;

    if(DataSoal === null) return { notFound: true }

    return {
        props: {
            Akun: session.props.Akun,
            DataSoal: {
                soal: DataSoal.soal,
                namasoal: DataSoal.namasoal,
                pembuat: {
                    username: DataSoal.pembuat.username
                },
                level: DataSoal.level,
                tags: DataSoal.tags,
                public: DataSoal.public,
                BahasaSoal: DataSoal.BahasaSoal,
                _id: DataSoal._id.toString()
            }
        }
    };
}

export default function Buat({ Akun, DataSoal }: { Akun: IAkun, DataSoal: ISoal }) {
    return (
        <>
            <Head>
                <title>Edit soal</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <BuatKomponen
                mode="edit"
                profile={Akun}
                data={DataSoal}
            />
        </>
    )
}