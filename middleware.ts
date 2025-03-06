import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const protectedRoutes = ["/admin"];

  // if (token) {
  //   try {
  //     const response = await fetch("http://localhost:8000/api/auth/me", {
  //       credentials: "include",
  //       // headers: {
  //       //   Authorization: `Bearer ${token}`,
  //       // },
  //       // credentials: "include",
  //     });

  //     console.log("response", response.ok);

  //     if (response.ok) {
  //       if (pathname === "/login") {
  //         return NextResponse.redirect(new URL("/admin/home", request.url));
  //       }

  //       if (pathname === "admin") {
  //         return NextResponse.redirect(new URL("/admin/home", request.url));
  //       }

  //       return NextResponse.next();
  //     }
  //   } catch (error) {
  //     console.error("Error validando el token:", error);
  //   }
  // }

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/admin/home", request.url));
    }

    if (pathname === "admin") {
      return NextResponse.redirect(new URL("/admin/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
