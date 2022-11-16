import BuatKomponen from '../../../components/BuatSoal';
import { prisma } from '../../../database/prisma';
import { UpdateInfoAkun } from '../../../services/Servis';
import { NextApiRequest, NextApiResponse } from 'next';
import { Akun } from '@prisma/client';
import { DataSoal, TipeProfile } from '../../../types/tipe';

export async function getServerSideProps({ params, req, res }: { params: { soal: string }, req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { redirect: string };
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

    console.log({ ...DataSoal });
    return {
        props: {
            data: {
                ...DataSoal
            },
            profile: {
                username: DapatinUser.username,
                gambar: DapatinUser.gambarurl,
                admin: DapatinUser.admin,
                moderator: DapatinUser.moderator
            }
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