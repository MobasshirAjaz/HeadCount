export { auth } from "@/auth";

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { auth } from "@/auth";

export const proxy = auth((req) => {
	if (!req.auth && (req.nextUrl.pathname !== "/signIn" && req.nextUrl.pathname !== "/signUp")) {
		const newUrl = new URL("/signIn", req.nextUrl.origin);
		return Response.redirect(newUrl);
	}
});
