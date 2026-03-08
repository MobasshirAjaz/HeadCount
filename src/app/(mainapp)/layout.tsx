import TopBar from "@/components/eventsPage/topbar/TopBar";
import UserNameModal from "@/components/eventsPage/usernameModal/UserNameModal";
import { auth } from "@/auth";
import { User } from "next-auth";
import { redirect } from "next/navigation";
import * as z from "zod";
import { UsernameModalSchema } from "@/lib/validations/userprofile.schema";
import { prisma } from "@/lib/db/prisma";

import { uploadFile } from "@/lib/utils/uploadFile";
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
	let fileurl;
	try {
		fileurl = await uploadFile(session, validated.data.image);
	} catch (error) {
		console.error("Failed to upload file:", error);
		return {
			data: {
				username: formData.username as string,
				image: prevstate.data?.image,
			},
			error: {
				message:
					"Something went wrong. Please try uploading image again.",
			},
		};
	}

	try {
		const updateUser = await prisma.user.update({
			where: { id: session.user.id },
			data: { username: formData.username, image: fileurl },
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
