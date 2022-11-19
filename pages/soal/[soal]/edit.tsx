import BuatKomponen from '../../../components/BuatSoal';
import { prisma } from '../../../database/prisma';
import { UpdateInfoAkun } from '../../../services/Servis';
import { NextApiRequest, NextApiResponse } from 'next';
import { DataSoal, HasilDapatinUser, TipeProfile } from '../../../types/tipe';

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
        <BuatKomponen
            mode="edit"
            profile={profile}
            data={data}
        />
    )
}