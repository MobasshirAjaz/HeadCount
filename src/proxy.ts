export { auth } from "@/auth";

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};

import { auth } from "@/auth";

export const proxy = auth((req) => {
	if (
		!req.auth &&
		req.nextUrl.pathname !== "/signIn" &&
		req.nextUrl.pathname !== "/signUp" &&
		req.nextUrl.pathname !== "/"
	) {
		const newUrl = new URL("/signIn", req.nextUrl.origin);
		return Response.redirect(newUrl);
	}
});
