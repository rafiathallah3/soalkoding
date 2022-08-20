import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import querystring from 'querystring';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const githubToken = await axios.post(`https://github.com/login/oauth/access_token?client_id=25bed176db5b6ad0e239&client_secret=1f514e5a2e4ec4dbd774ece5165ed7704524abcb&code=${req.query.code}`).then(res => res.data);
    const decoded = querystring.parse(githubToken);
    const access_token = decoded.access_token;

    const data = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${access_token}` }
    }).then(res => res.data);
    console.log(data);

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

	console.log(req.query);
    console.log(req.body);
    res.redirect('/dashboard');
}