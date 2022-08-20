import { NextRequest, NextResponse } from "next/server";
import { verify } from './services/jwt_sign';
import { serialize } from "cookie";

const secret = process.env.SECRET!;

export default async function middleware(req: NextRequest) {
    const infoakun = req.cookies.get("infoakun");

    if(req.nextUrl.pathname.startsWith("/dashboard")) {
        if(infoakun === undefined) return NextResponse.redirect(new URL("/login", req.url));
        try {
            const hasilToken = await verify(infoakun, secret);
            if(!hasilToken) throw 'Waduh token tidak SOLID SOLID SOLID'
            return NextResponse.next();
        } catch (e) {
            // const encode = serialize("infoakun", null, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV !== "development",
            //     sameSite: "strict",
            //     maxAge: 60 * 60 * 24 * 30,
            //     path: "/login"
            // });
            
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }
    
    if(req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")) {
        if(infoakun !== undefined) {
            const hasilToken = await verify(infoakun, secret);
            if(hasilToken === false) return NextResponse.next();

            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    return NextResponse.next();
}