import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			username?: string | null;
			email: string;
		} & DefaultSession["user"];
	}

	interface User {
		username?: string | null;
		email: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		username?: string | null;
		email: string;
	}
}
