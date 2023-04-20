import axios from "axios";
import { useState } from "react";

export default function FavoritKomponen({ data }: { data: { suka_ngk: boolean, berapa: any, idsoal: string } }) {
    const [Favorit, setFavorit] = useState<{ suka_ngk: boolean, berapa: number }>({
        suka_ngk: data.suka_ngk,
        berapa: data.berapa
    });

    const FavoritSoal = async () => {
        const _data = await axios.post("/api/soal/favorit", {
            idsoal: data.idsoal
        }).then(d => d.data);

        setFavorit({
            suka_ngk: _data.suka_ngk,
            berapa: _data.berapa
        })
    }

    return (
        <>
            <style jsx>{`
            .favorit:hover {
                color: rgb(180, 180, 180);
                cursor: pointer;
            }
            `}</style>
            <span className="me-4 favorit" onClick={FavoritSoal}>
                {Favorit.suka_ngk ?
                    <i className="bi bi-star-fill me-1"></i>
                    :
                    <i className="bi bi-star me-1"></i>
                }
                {Favorit.berapa}
            </span>
        </>
    )
}