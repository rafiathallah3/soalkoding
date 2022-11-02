import BuatKomponen from '../../../components/BuatSoal';
import { prisma } from '../../../database/prisma';
import { UpdateInfoAkun } from '../../../services/Servis';
import { NextApiRequest, NextApiResponse } from 'next';
import { Akun } from '@prisma/client';
import { DataSoal } from '../../../types/tipe';

export async function getServerSideProps({ params, req, res }: { params: { soal: string }, req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as Akun & { redirect: string };
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    const DataSoal = await prisma.soal.findFirst({
        where: {
            id: params.soal,
            idpembuat: DapatinUser.id
        },
        include: {
            kumpulanjawaban: true
        }
    });

    if (DataSoal === null) return { redirect: { destination: `/dashboard`, permanent: false } }

    return {
        props: {
            data: {
                id: DataSoal.id,
                namasoal: DataSoal.namasoal,
                level: DataSoal.level,
                tags: DataSoal.tags,
                soal: DataSoal.soal,
                public: DataSoal.public,
                kumpulanjawaban: DataSoal.kumpulanjawaban
            }
        }
    }
}

export default function Edit({ data }: { data: DataSoal }) {
    return (
        <BuatKomponen
            mode="edit"
            data={data}
        />
    )
}