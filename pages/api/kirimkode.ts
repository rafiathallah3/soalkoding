import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function KirimKode(req: NextApiRequest, res: NextApiResponse) {
    const { kode, idBahasaProgram } = req.body;

    const optionsKode = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {base64_encoded: 'true', fields: '*'},
        headers: {
          'content-type': 'application/json',
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': 'f38f691e55msh0fe8fe0664c2f93p19b9cfjsn7089cc25781e',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: JSON.stringify({
            language_id: idBahasaProgram,
            source_code: btoa(kode)
        })
        // data: '{"language_id":52,"source_code":"I2luY2x1ZGUgPHN0ZGlvLmg+CgppbnQgbWFpbih2b2lkKSB7CiAgY2hhciBuYW1lWzEwXTsKICBzY2FuZigiJXMiLCBuYW1lKTsKICBwcmludGYoImhlbGxvLCAlc1xuIiwgbmFtZSk7CiAgcmV0dXJuIDA7Cn0=","stdin":"SnVkZ2Uw"}'
    };

    
    const hasilData = await axios.request(optionsKode).then(d => d.data);
    
    const optionsDecode = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${hasilData.token}`,
        params: {base64_encoded: true, fields: '*'},
        headers: {
            'X-RapidAPI-Key': 'f38f691e55msh0fe8fe0664c2f93p19b9cfjsn7089cc25781e',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
    }

    const hasilDecode = await axios.request(optionsDecode).then(d => d.data);

    if(hasilDecode.stdout !== null) {
        return res.json({
            status: "Sukses",
            output: new Buffer(hasilDecode.stdout.replace("\n", "")).toString('utf-8')
        });
    }

    const error = hasilDecode.compile_output === null ? hasilDecode.stderr : hasilDecode.compile_output;
    // console.log(hasilDecode)
    return res.json({
        status: "error",
        error: new Buffer(error.replace("\n", ""), 'base64').toString('utf-8')
    })
    // console.log(new Buffer(hasilDecode.compile_output.replace("\n", ""), 'base64').toString('utf-8'));

}