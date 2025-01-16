import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";
import type { Session } from "./lib/auth-types";

export async function middleware(request: NextRequest) {
  try {
    // اصلاح مسیر API
    const baseURL = process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://foshati.ir";

    const response = await betterFetch<Session>("/api/auth/get-session", {
      baseURL,
      headers: {
        cookie: request.headers.get("cookie") || "",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    });

    if (!response.data) {
      // redirect به sign-in با callbackUrl
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/sign-in?callbackUrl=${callbackUrl}`, request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*"
  ]
};