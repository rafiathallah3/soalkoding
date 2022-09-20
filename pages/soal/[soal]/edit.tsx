import BuatKomponen from '../../../components/BuatSoal';
import { useRouter } from 'next/router';

export default function Edit() {
    const router = useRouter();
    const { soal } = router.query;

    return (
        <BuatKomponen 
            mode="edit"
            idsoal={ soal as string }
        />
    )
}