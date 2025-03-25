import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  // const token = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;
  const protectedRoutes = ["/admin"];

  if (pathname === "/") {
    // if (token) {
    //   try {
    //     const response = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    //       {
    //         headers: {
    //           Authorization: `${token}`,
    //         },
    //       }
    //     );

    //     if (response.ok) {
    //       return NextResponse.redirect(new URL("/admin/home", request.url));
    //     }
    //   } catch (error) {
    //     console.error("Error validando el token:", error);
    //   }
    // }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login") {
    // if (token) {
    //   try {
    //     const response = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    //       {
    //         headers: {
    //           Authorization: `${token}`,
    //         },
    //       }
    //     );

    //     if (response.ok) {
    //       return NextResponse.redirect(new URL("/admin/home", request.url));
    //     }
    //   } catch (error) {
    //     console.error("Error validando el token:", error);
    //   }
    // }
    return NextResponse.next();
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
    // }

    // try {
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    //     {
    //       headers: {
    //         Authorization: `${token}`,
    //       },
    //     }
    //   );

    //   if (!response.ok) {
    //     console.warn("Token inválido, redirigiendo a /login");
    //     return NextResponse.redirect(new URL("/login", request.url));
    //   }
    // } catch (error) {
    //   console.error("Error validando el token:", error);
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
