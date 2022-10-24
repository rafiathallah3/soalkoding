import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../database/prisma";
import { KirimNotifikasi } from "../../../services/Servis";
import Verifikasi from "../../../services/VerifikasiAkun";
import { WarnaStatus } from "../../../types/tipe";

export default async function updateProfile(req: NextApiRequest, res: NextApiResponse) {
	if(req.method === "POST") {
		const verifikasi = Verifikasi(req, res);
        if(typeof verifikasi === 'number') return res.status(verifikasi).send(`Error ${verifikasi}`);

		const { nama, tinggal, bio, url, username, email } = req.body;
		//filter

		if(username.replace(/\s\s+/g, ' ').trim().length <= 3) {
			KirimNotifikasi(WarnaStatus.kuning, "Ada yang salah saat mengupdate profile", { req, res });
			return res.redirect("/profile/edit");
		}

		await prisma.akun.update({
			where: {
				id: verifikasi
			},
			data: {
				...req.body,
				username: username.replace(/\s\s+/g, ' ').trim()
			}
		});

		KirimNotifikasi(WarnaStatus.biru, "Profile sudah berhasil di update", { req, res });
		return res.redirect('/profile/'+username);
	}
	return res.status(405).send("Error: 405");
}

// import nextConnect from "next-connect";
// import multer from "multer";
// import { verify } from '../../../services/jwt_sign';
// import { NextApiRequest, NextApiResponse } from "next";
// import kuripto from 'crypto';
// import { decrypt } from "../../../database/UbahKeHash";
// import Verifikasi from "../../../services/VerifikasiAkun";
// import { deleteCookie } from "cookies-next";

// let filename = kuripto.randomBytes(5).toString('hex') + "-" + new Date().getTime();
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: function(req, file, cb) {
//             cb(null, '/public/profile');
//         },
//         filename: function(req, file, cb) {
//             console.log("Miencraft");
//             cb(null, getFileName(file))
//         }
//     }),
// });

// const getFileName = (file: any) => {
//     filename +=
//         "." +
//         file.originalname.substring(
//             file.originalname.lastIndexOf(".") + 1,
//             file.originalname.length
//         );
//     return filename;
// };

// const updateProfile = nextConnect<NextApiRequest, NextApiResponse>({
//     onError(error, req, res) {
//         res.status(404).json({"error": error.toString()});
//     },
//     onNoMatch(req, res) {
//         res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//     },
// });

// updateProfile.use(async (req, res, next) => {
//     console.log("PLSS LAH JALAN")
//     if(req.cookies.infoakun === undefined) {
//         throw new Error("Tidak ada akun");
//     }

//     // const Infoomasi = await verify(req.cookies.infoakun, process.env.TOKENRAHASIA!) as { datanya: {iv: string, IniDataRahasia: string} } | boolean;
//     const verifikasi = Verifikasi(req, res);
//     if(typeof verifikasi === 'number') {
//         deleteCookie('infoakun', { req, res });
//         deleteCookie('perbaruitoken', { req, res });
//         throw new Error(`Error: ${verifikasi}`);
//     }
//     // const HasilDecrypt: {username: string} = JSON.parse(decrypt(Infoomasi.datanya));
//     // console.log(HasilDecrypt);
//     next();
// })
//     .use(upload.single("file"));

// updateProfile.post((req, res) => {
//     console.log(req.body);
//     res.status(200).json({ data: `/profile/${filename}` }); // response
// });

// export const config = {
//     api: {
//         bodyParser: false, // Disallow body parsing, consume as stream
//     },
// };

// export default updateProfile;

// // export default function updateProfile(req: NextApiRequest, res: NextApiResponse) {
// //     console.log("aint no way",req.body);
// //     return res.status(200).send("Minecraft");
// // }