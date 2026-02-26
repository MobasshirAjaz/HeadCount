import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import argon2 from "argon2";
import { prisma } from "@/lib/db/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
	pages: {
		signIn: "/signIn",
	},
	callbacks: {
		authorized: async ({ auth }) => {
			return !!auth;
		},
	},
	providers: [
		Credentials({
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials) => {
				console.log(credentials);
				if (!credentials?.email || !credentials?.password) {
					throw new CredentialsSignin();
				}
				const user = await prisma.user.findUnique({
					where: {
						email: credentials?.email as string,
					},
				});

				if (!user || !user.password) {
					throw new CredentialsSignin();
				}

				const passwordVerified = await argon2.verify(
					user.password,
					credentials.password as string,
				);

				if (!passwordVerified) {
					throw new CredentialsSignin();
				}

				return {
					id: user.id,
					email: user.email,
				};
			},
		}),
	],
});
