import type { NextRequest } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    });

    const { isSignedIn } = await clerkClient.authenticateRequest(request, {
      jwtKey: process.env.CLERK_JWT_KEY,
    });

    if (!isSignedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!api/examples|_next/static|_next/image|favicon.ico).*)",
  ],
};
