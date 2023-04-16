import { NextApiRequest, NextApiResponse } from "next";
import { ApakahSudahMasuk, cloudinary } from "../../../../lib/Servis";
import { DataModel } from "../../../../lib/Model";
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function updateProfile(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const session = await ApakahSudahMasuk(req, res);
        if(!session.props) return res.redirect("/login");

        const form = formidable({ keepExtensions: true, multiples: true, allowEmptyFiles: true });
        form.parse(req, async (err, fields, files: any) => {
            if(err) {
                return res.status(400).send(err);
            }

            if(files.foto) {
                cloudinary.uploader.upload(files.foto.filepath, { width: 300, height: 300, public_id: session.props.Akun.id,  }, async (err, Hasil) => {
                    if(err) console.log(err);
                    
                    await DataModel.AkunModel.updateOne({ username: session.props.Akun.username }, {
                        gambar: Hasil?.url || "/GambarProfile.jpg",
                    });
                });
            }

            await DataModel.AkunModel.updateOne({ username: session.props.Akun.username }, {
                nama: fields.nama,
                tinggal: fields.tinggal,
                bio: fields.bio,
                website: fields.website,
                usenrame: fields.username,
                email: fields.email
            });
        });


        return res.send("sukses");
        // return res.redirect("/profile/edit");
    }

    return res.status(405).send("Method not allowed");
}