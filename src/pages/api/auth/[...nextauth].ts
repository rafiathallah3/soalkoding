import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDb from "../../../../lib/mongodb";
import { DataModel } from "../../../../lib/Model";
import bcrypt from 'bcrypt';
import { IAkun } from "../../../../types/tipe";
import { JWT } from "next-auth/jwt";
import { getServerSession } from 'next-auth';

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const { email, password } = credentials as { email: string, password: string };
                
                connectDb();

                const akun = await DataModel.AkunModel.findOne({ email }) as IAkun || undefined;
                if(akun && akun.password && bcrypt.compareSync(password, akun.password)) {
                    return {
                        id: akun._id,
                        email: akun.email,
                        name: akun.username,
                        password: akun.password,
                        image: akun.gambar
                    }
                }

                return null;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT, user: any }) {
            if (user?._id) token._id = user._id;
            return token;
        },
        async session({ session, token }: { token: any, session: any }) {
            if (token?._id) session.user._id = token._id;
            return session;
        },
        async signIn({ account, profile, user }) {
            if(account?.provider === "github") {
                //next auth tidak support hubungkan social akun :( 16/04/2023 11:18
                connectDb();
                
                const ApakahAdaEmailDanUsername = await DataModel.AkunModel.findOne({
                    $or: [
                        { email: user.email },
                        { username: user.name }
                    ]
                }) as IAkun | null;

                if(ApakahAdaEmailDanUsername === null) {
                    await DataModel.AkunModel.create({
                        email: (profile as { email: string }).email, username: (profile as { login: string }).login, gambar: (profile as { avatar_url: string }).avatar_url, MasukDenganGithub: true, githuburl: (profile as { html_url: string }).html_url
                    });

                    return true;
                }
            }

            if(user) return true;
            return false;
        },
    }
}
export default NextAuth(authOptions)