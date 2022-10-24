import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { prisma } from '../../database/prisma';
import { APIEmailsGithub, APIProfileGithub } from '../../types/tipe';
// import { setCookie } from 'cookies-next';
// import { encrypt } from '../../database/UbahKeHash';
// import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.cookies);
    const { code, state } = req.query;
    
    const DataAkun = await prisma.akun.findFirst({
        where: {
            githubstate: state as string
        }
    });

    if(DataAkun === null) {
        return res.status(403).send("Request state tidak sesuai");
    }
   
    const githubToken: { access_token: string, token_type: string } = await axios.post(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`, {}, {
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => res.data);
    console.log(githubToken);

    const DataUser: APIProfileGithub = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${githubToken.access_token}` }
    }).then(d => d.data);
    const DataEmail: APIEmailsGithub[] = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${githubToken.access_token}` }
    }).then(d => d.data);

    // {
    //     login: 'rafiathallah3',
    //     id: 65345768,
    //     node_id: 'MDQ6VXNlcjY1MzQ1NzY4',
    //     avatar_url: 'https://avatars.githubusercontent.com/u/65345768?v=4',
    //     gravatar_id: '',
    //     url: 'https://api.github.com/users/rafiathallah3',
    //     html_url: 'https://github.com/rafiathallah3',
    //     followers_url: 'https://api.github.com/users/rafiathallah3/followers',
    //     following_url: 'https://api.github.com/users/rafiathallah3/following{/other_user}',
    //     gists_url: 'https://api.github.com/users/rafiathallah3/gists{/gist_id}',
    //     starred_url: 'https://api.github.com/users/rafiathallah3/starred{/owner}{/repo}',
    //     subscriptions_url: 'https://api.github.com/users/rafiathallah3/subscriptions',
    //     organizations_url: 'https://api.github.com/users/rafiathallah3/orgs',
    //     repos_url: 'https://api.github.com/users/rafiathallah3/repos',
    //     events_url: 'https://api.github.com/users/rafiathallah3/events{/privacy}',
    //     received_events_url: 'https://api.github.com/users/rafiathallah3/received_events',
    //     type: 'User',
    //     site_admin: false,
    //     name: 'rapithon',
    //     company: null,
    //     blog: '',
    //     location: 'Jakarta, Indonesia',
    //     email: null,
    //     hireable: null,
    //     bio: "Hello, I love programming \r\n\r\nI'm turning 15 years old on 26 May!",
    //     twitter_username: null,
    //     public_repos: 9,
    //     public_gists: 0,
    //     followers: 0,
    //     following: 0,
    //     created_at: '2020-05-14T11:53:16Z',
    //     updated_at: '2022-08-16T14:19:39Z',
    //     private_gists: 0,
    //     total_private_repos: 6,
    //     owned_private_repos: 6,
    //     disk_usage: 111376,
    //     collaborators: 0,
    //     two_factor_authentication: false,
    //     plan: {
    //       name: 'free',
    //       space: 976562499,
    //       collaborators: 0,
    //       private_repos: 10000
    //     }
    //   }
    
    if(DataAkun !== null) {
        // if(Object.keys(req.cookies).length === 0) {
        //     const EncryptData = encrypt(JSON.stringify({id: DataAkun.id}));
		// 	const token = jwt.sign({ datanya: EncryptData }, process.env.TOKENRAHASIA!, { expiresIn: '1h' });
        //     setCookie('infoakun', token, {req, res, httpOnly: true, secure: process.env.NODE_ENV !== "development", sameSite: 'strict', maxAge: 60 * 60 * 24 * 30, path: '/'})
        //     setCookie('perbaruitoken', DataAkun.perbaruiToken, {req, res, httpOnly: true, secure: process.env.NODE_ENV !== "development", sameSite: 'strict', maxAge: 60 * 60 * 24 * 30, path: '/'})
        //     console.log(token, '\n', DataAkun.perbaruiToken);
        // }
        // console.log("Ke profile edit");
        
        const d = await prisma.akun.update({
            where: {
                id: DataAkun.id
            },
            data: {
                githuburl: DataUser.html_url,
                gambarurl: DataUser.avatar_url
            }
        });

        return res.status(200).redirect('/profile/edit');
    }
}