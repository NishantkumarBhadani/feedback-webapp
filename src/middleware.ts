import { NextRequest,NextResponse } from "next/server";
// import {default} from "next-auth/middleware"; //from entire site will get middleware
import { getToken } from "next-auth/jwt"; //   for getting tokens

export async function middleware(request:NextRequest){
    const token=await getToken({req:request})
    const url=request.nextUrl

    if(token && (url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify')||
        url.pathname.startsWith('/'))
    ){
            return NextResponse.redirect(new URL('/dashboard',request.url))
        }
}
//configuring path where our middleware should run
export const config = {
    matcher:[
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',// implemetented all in dashbaord
        '/verify/:path*'
    ]
}

// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const { pathname } = request.nextUrl;

//   // If user NOT logged in and tries dashboard
//   if (!token && pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   // If user logged in and tries auth pages
//   if (
//     token &&
//     (pathname.startsWith("/sign-in") ||
//       pathname.startsWith("/sign-up"))
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/sign-in",
//     "/sign-up",
//     "/verify/:path*"
//   ],
// };