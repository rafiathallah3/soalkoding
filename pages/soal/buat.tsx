import { NextApiRequest, NextApiResponse } from "next";
import BuatKomponen from "../../components/BuatSoal";
import { UpdateInfoAkun } from "../../services/Servis";
import { HasilDapatinUser, TipeProfile } from "../../types/tipe";

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const DapatinUser = await UpdateInfoAkun(req, res, true) as HasilDapatinUser;
    if (DapatinUser.redirect !== undefined) return DapatinUser;

    return {
        props: {
            profile: DapatinUser.profile
        }
    }
}

export default function Buat({ profile }: { profile: TipeProfile }) {
    return (
        <BuatKomponen
            profile={profile}
            mode="buat"
        />
    )
}