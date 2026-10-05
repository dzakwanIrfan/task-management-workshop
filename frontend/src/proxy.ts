import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_KEY } from "./features/auth/session";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/tasks/:path*",
};
