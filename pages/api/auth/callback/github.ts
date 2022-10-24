import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../database/prisma";
import { decrypt, encrypt } from "../../../../database/UbahKeHash";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { APIEmailsGithub, APIProfileGithub, WarnaStatus } from "../../../../types/tipe";
import { KirimNotifikasi } from "../../../../services/Servis";
import axios from "axios";
import jwt from 'jsonwebtoken';

export default async function Github(req: NextApiRequest, res: NextApiResponse) {
    const { code, state } = req.query;

    const githubToken: { access_token: string, token_type: string } = await axios.post(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`, {}, {
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => res.data);

    const GithubDataUser: APIProfileGithub = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${githubToken.access_token}` }
    }).then(d => d.data);

    const GithubDataEmail: APIEmailsGithub[] = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${githubToken.access_token}` }
    }).then(d => d.data);
    

    if(req.cookies.infoakun !== undefined) {
        const DataUser = await prisma.akun.findUnique({
            where: {
                id: JSON.parse(decrypt((jwt.verify(req.cookies.infoakun, process.env.TOKENRAHASIA!) as any).datanya)).id
            },
            include: {
                akungithub: true
            }
        });

        if(DataUser === null) {
            deleteCookie('infoakun', { req, res });
            deleteCookie('perbaruitoken', { req, res });
            return res.redirect("/login");
        }

        console.log(DataUser.githubstate, "  ", state);
        if(DataUser.githubstate !== state) return res.redirect("/profile/edit");
        
        const ApakahAkunGithubAda = await prisma.akunGithub.findUnique({
            where: {
                email_username: {
                    email: GithubDataEmail[0].email,
                    username: GithubDataUser.login
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        password: true
                    }
                }
            }
        })

        if(ApakahAkunGithubAda === null) {
            await prisma.akun.update({
                where: {
                    id: DataUser.id
                },
                data: {
                    bio: !DataUser.bio ? GithubDataUser.bio : DataUser.bio,
                    tinggal: !DataUser.tinggal ? GithubDataUser.location : DataUser.tinggal,
                    nama: !DataUser.nama ? GithubDataUser.name : DataUser.nama,
                    gambarurl: GithubDataUser.avatar_url,
                    githubstate: null,
                    akungithub: {
                        create: {
                            email: GithubDataEmail[0].email,
                            username: GithubDataUser.login,
                            gambar: GithubDataUser.avatar_url
                        }
                    }
                }
            });

            KirimNotifikasi(WarnaStatus.biru, "Akun github sudah berhasil di hubung!", { req, res });
            return res.redirect("/profile/edit");
        }

        if(ApakahAkunGithubAda.user === null) {
            await prisma.akun.update({
                where: {
                    id: DataUser.id
                },
                data: {
                    bio: !DataUser.bio ? GithubDataUser.bio : DataUser.bio,
                    tinggal: !DataUser.tinggal ? GithubDataUser.location : DataUser.tinggal,
                    nama: !DataUser.nama ? GithubDataUser.name : DataUser.nama,
                    gambarurl: GithubDataUser.avatar_url,
                    githubstate: null,
                    akungithub: {
                        connect: {
                            email_username: {
                                email: GithubDataEmail[0].email,
                                username: GithubDataUser.login
                            }
                        }
                    }
                }
            });

            KirimNotifikasi(WarnaStatus.biru, "Akun github sudah berhasil di hubung!", { req, res });
            return res.redirect("/profile/edit");
        }

        if(ApakahAkunGithubAda.user.email === "" || ApakahAkunGithubAda.user.username === "" || ApakahAkunGithubAda.user.password === "") {
            await prisma.akun.delete({
                where: {
                    id: ApakahAkunGithubAda.user.id
                }
            });

            await prisma.akun.update({
                where: {
                    id: DataUser.id
                },
                data: {
                    bio: !DataUser.bio ? GithubDataUser.bio : DataUser.bio,
                    tinggal: !DataUser.tinggal ? GithubDataUser.location : DataUser.tinggal,
                    nama: !DataUser.nama ? GithubDataUser.name : DataUser.nama,
                    gambarurl: GithubDataUser.avatar_url,
                    githubstate: null,
                    akungithub: {
                        connect: {
                            email_username: {
                                email: GithubDataEmail[0].email,
                                username: GithubDataUser.login
                            }
                        }
                    }
                }
            });

            KirimNotifikasi(WarnaStatus.biru, "Akun github sudah berhasil di hubung!", { req, res });
            return res.redirect("/profile/edit");
        }

        KirimNotifikasi(WarnaStatus.kuning, "Githubnya sudah terhubung dengan akun lain!", { req, res });
        return res.redirect("/profile/edit");
    }

    const StateKue = getCookie('IniStateGithub_NantiJugaDihapus', { req, res });
    if(state !== StateKue) return res.redirect("/login");

    const ApakahAda = await prisma.akunGithub.findUnique({
        where: {
            email_username: {
                email: GithubDataEmail[0].email,
                username: GithubDataUser.login
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    username: true
                }
            }
        }
    });
    console.log(ApakahAda);

    if(ApakahAda === null) {
        console.log("Tidak ada akun github akan dibuat!");
        const DataAkun = await prisma.akun.create({
            data: {
                username: "",
                email: "",
                password: '',
                nama: GithubDataUser.name,
                bio: GithubDataUser.bio,
                tinggal: GithubDataUser.location,
                gambarurl: GithubDataUser.avatar_url,
                akungithub: {
                    create: {
                        email: GithubDataEmail[0].email,
                        username: GithubDataUser.login,
                    }
                }
            }
        });

        console.log(DataAkun);

        const EncryptData = encrypt(JSON.stringify({id: DataAkun.id}));
        const token = jwt.sign({ datanya: EncryptData }, process.env.TOKENRAHASIA!, { expiresIn: '1h' });
        const PerbaruiToken = jwt.sign({ datanya: EncryptData }, process.env.PERBARUITOKEN!);

        await prisma.akun.update({
            where: {
                id: DataAkun.id
            },
            data: {
                perbaruiToken: PerbaruiToken
            }
        });
        
        setCookie('infoakun', token, {req, res, httpOnly: true, maxAge: 60 * 60 * 24 * 30, path: '/', secure: process.env.NODE_ENV !== "development"});
        setCookie('perbaruitoken', PerbaruiToken, {req, res, httpOnly: true, maxAge: 60 * 60 * 24 * 30, path: '/', secure: process.env.NODE_ENV !== "development"});

        return res.redirect("/register/daftargithub");
    }

    if(ApakahAda.user === null) {
        KirimNotifikasi(WarnaStatus.merah, "Tidak bisa menemukan akun github", { req, res });
        return res.redirect('/login');  
    }

    console.log("Ada akun dan user dalam github database");
    const EncryptData = encrypt(JSON.stringify({id: ApakahAda.user.id}));
    const token = jwt.sign({ datanya: EncryptData }, process.env.TOKENRAHASIA!, { expiresIn: '1h' });
    const PerbaruiToken = jwt.sign({ datanya: EncryptData }, process.env.PERBARUITOKEN!);

    setCookie('infoakun', token, {req, res, httpOnly: true, maxAge: 60 * 60 * 24 * 30, path: '/', secure: process.env.NODE_ENV !== "development"});
    setCookie('perbaruitoken', PerbaruiToken, {req, res, httpOnly: true, maxAge: 60 * 60 * 24 * 30, path: '/', secure: process.env.NODE_ENV !== "development"});

    await prisma.akun.update({
        where: {
            id: ApakahAda.user.id
        },
        data: {
            perbaruiToken: PerbaruiToken
        }
    });

    return res.redirect("/dashboard");
}