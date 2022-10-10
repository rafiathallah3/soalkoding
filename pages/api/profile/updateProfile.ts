import nextConnect from "next-connect";
import multer from "multer";
import { verify } from '../../../services/jwt_sign';
import { NextApiRequest, NextApiResponse } from "next";
import kuripto from 'crypto';
import { decrypt } from "../../../database/UbahKeHash";

let filename = kuripto.randomBytes(5).toString('hex') + "-" + new Date().getTime();
const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'public/profile');
        },
        filename: function(req, file, cb) {
            cb(null, getFileName(file))
        }
    }),
});

const getFileName = (file: any) => {
    filename +=
        "." +
        file.originalname.substring(
            file.originalname.lastIndexOf(".") + 1,
            file.originalname.length
        );
    return filename;
};

const updateProfile = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(404).json({"error": error.toString()});
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

updateProfile.use(async (req, res, next) => {
    if(req.cookies.infoakun === undefined) {
        throw new Error("Tidak ada akun");
    }

    const Infoomasi = await verify(req.cookies.infoakun, process.env.SECRET!) as { datanya: {iv: string, IniDataRahasia: string} } | boolean;
    if(Infoomasi === false) {
        throw new Error("Tidak ada akun");
    }
    // const HasilDecrypt: {username: string} = JSON.parse(decrypt(Infoomasi.datanya));
    // console.log(HasilDecrypt);
})
    // .use(upload.single("file"));

updateProfile.post((req, res) => {
    res.status(200).json({ data: `/profile/${filename}` }); // response
});

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};

export default updateProfile;