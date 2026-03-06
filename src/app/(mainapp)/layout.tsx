import TopBar from "@/components/eventsPage/topbar/TopBar";
import UserNameModal from "@/components/eventsPage/usernameModal/UserNameModal";
import { auth } from "@/auth";
import { User } from "next-auth";
import { redirect } from "next/navigation";
import * as z from "zod";
import { UsernameModalSchema } from "@/lib/validations/userprofile.schema";
import { prisma } from "@/lib/db/prisma";

import { writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

type State = {
	data?: {
		username?: string;
		image?: string;
	};
	error?: {
		message?: string;
	};
};
type FormDataType = z.infer<typeof UsernameModalSchema>;
type Actionfn = (prevstate: State, formData: FormDataType) => Promise<State>;
const usernameServerAction: Actionfn = async (prevstate, formData) => {
	"use server";
	const session = await auth();
	if (!session) {
		redirect("/signIn");
	}

	const validated = UsernameModalSchema.safeParse(formData);
	if (!validated.success) {
		const flattened = z.flattenError(validated.error);
		return {
			data: {
				username: formData.username as string,
				image: prevstate.data?.image,
			},
			error: {
				message:
					flattened.fieldErrors.username?.[0] ||
					flattened.fieldErrors.image?.[0],
			},
		};
	}

	const isFileEmpty = (file: any) => {
		// 1. Catches undefined, null, empty strings, and the literal string "undefined"
		if (!file || file === "undefined" || file === "") return true;

		// 2. Catches the browser's 0-byte ghost file
		if (typeof file === "object" && "size" in file && file.size === 0)
			return true;

		// 3. Catches files named "undefined" (a common FormData artifact)
		if (
			typeof file === "object" &&
			"name" in file &&
			file.name === "undefined"
		)
			return true;

		return false;
	};
	const file = formData.image;
	let filepath = null;
	let newfilename = null;
	if (file && !isFileEmpty(file)) {
		const originalName = formData.image?.name;
		const timestamp = Date.now();
		const uid = session?.user.id;

		newfilename = `${uid}-${timestamp}-${originalName}`;
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const uploaddir = path.join(process.cwd(), "public/uploads");
		filepath = path.join(uploaddir, newfilename);

		try {
			await writeFile(filepath, buffer);
			console.log("File saved successfully");
		} catch (error) {
			console.error("Failed to save file : ", error);
			return {
				data: {
					image: prevstate.data?.image,
					username: prevstate.data?.username,
				},
				error: {
					message: "Something went wrong. Please try again.",
				},
			};
		}
	}

	try {
		const updateUser = await prisma.user.update({
			where: { id: session.user.id },
			data: { username: formData.username, image: newfilename },
		});
		revalidatePath("/", "layout");
	} catch (error) {
		console.log("Failed to update db: ", error);
		return {
			data: {
				image: prevstate.data?.image,
				username: prevstate.data?.username,
			},
			error: {
				message: "Something went wrong. Please try again.",
			},
		};
	}

	return {};
};
export default async function MainAppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (!session) {
		redirect("/signIn");
	}
	console.log("User inside layout=", session?.user);

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { id: true, email: true, username: true, image: true },
	});

	if (!user) {
		redirect("/signIn");
	}

	console.log("User from Db:", user);
	return (
		<>
			{user.username === null && (
				<UserNameModal
					serveraction={usernameServerAction}
				></UserNameModal>
			)}
			<TopBar user={user}></TopBar>
			<main>{children}</main>
		</>
	);
}
