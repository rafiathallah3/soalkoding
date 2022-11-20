import BuatKomponen from '../../../components/BuatSoal';
import { prisma } from '../../../database/prisma';
import { UpdateInfoAkun } from '../../../services/Servis';
import { NextApiRequest, NextApiResponse } from 'next';
import { DataSoal, HasilDapatinUser, TipeProfile } from '../../../types/tipe';
import Head from 'next/head';

export async function getServerSideProps({ params, req, res }: { params: { soal: string }, req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as HasilDapatinUser;
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    const DataSoal = await prisma.soal.findFirst({
        where: {
            id: params.soal,
        },
        select: {
            id: true,
            namasoal: true,
            level: true,
            tags: true,
            soal: true,
            public: true,
            kumpulanjawaban: true,
            pembuat: {
                select: {
                    username: true
                }
            }
        },
    });

    if (DataSoal === null) return { redirect: { destination: `/dashboard`, permanent: false } }

    return {
        props: {
            data: {
                ...DataSoal
            },
            profile: DapatinUser.profile
        }
    }
}

export default function Edit({ data, profile }: { data: DataSoal, profile: TipeProfile }) {
    return (
        <>
            <Head>
                <title>Edit soal</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <BuatKomponen
                mode="edit"
                profile={profile}
                data={data}
            />
        </>
    )
}