"use client";

import styles from "./styles.module.scss";
import Image from "next/image";
import { UsernameModalSchema } from "@/lib/validations/userprofile.schema";
import * as z from "zod";
import { useActionState, useRef, useState } from "react";
import { handler } from "next/dist/build/templates/app-page";

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

export default function UserNameModal({
	serveraction,
}: {
	serveraction: Actionfn;
}) {
	async function serveractionproxy(
		prevstate: State,
		formData: FormData,
	): Promise<State> {
		const fielddata = Object.fromEntries(formData.entries());
		const validated = UsernameModalSchema.safeParse(fielddata);
		if (!validated.success) {
			const flattened = z.flattenError(validated.error);
			return {
				data: {
					username: fielddata.username as string,
					image: prevstate.data?.image,
				},
				error: {
					message:
						flattened.fieldErrors.username?.[0] ||
						flattened.fieldErrors.image?.[0],
				},
			};
		}
		return await serveraction(prevstate, validated.data);
	}
	const initialState: State = {
		data: {
			username: "",
			image: "/user.png",
		},
		error: {
			message: "",
		},
	};
	const [state, actionfn, isPending] = useActionState(
		serveractionproxy,
		initialState,
	);

	const [previewURL, setPreviewURL] = useState(initialState.data?.image);
	const fileinput = useRef<HTMLInputElement>(null);

	function handleuploadclick() {
		fileinput.current?.click();
	}

	function handleremove() {
		setPreviewURL(initialState.data?.image);
	}

	function handlefilechange(event: React.ChangeEvent<HTMLInputElement>) {
		console.log("came here");
		const file = fileinput.current?.files?.[0];
		console.log("file=", file);
		if (file) {
			const url = URL.createObjectURL(file);
			console.log("url=", url);
			setPreviewURL(url);
		}
	}
	return (
		<dialog className={`${styles.usernamedialog}`} open closedby="any">
			<form action={actionfn}>
				<div className={`${styles.imageuploadarea}`}>
					<div className={`${styles.imagecontainer}`}>
						<Image
							src={
								previewURL ??
								(initialState.data?.image as string)
							}
							width={60}
							height={60}
							alt="Profile picture"
							unoptimized
						></Image>
					</div>
					<div className={`${styles.uploadbuttonarea}`}>
						<input
							name="image"
							type="file"
							ref={fileinput}
							style={{ display: "none" }}
							onChange={(e) => handlefilechange(e)}
						/>
						<button
							type="button"
							className={`${styles.imagebutton}`}
							onClick={handleuploadclick}
						>
							Upload
						</button>
						<button
							type="button"
							className={`${styles.imagebutton}`}
							onClick={handleremove}
							disabled={isPending}
						>
							Remove
						</button>
					</div>
				</div>
				<div className={`${styles.inputarea}`}>
					<label htmlFor="username">Username</label>
					<input
						className={`${styles.textbox} ${state.error?.message && styles.fielderror}`}
						type="text"
						name="username"
						id="username"
						defaultValue={state.data?.username}
					/>
					<p
						className={`${styles.errormessage} ${state?.error?.message && styles.error}`}
					>
						{state.error?.message}
					</p>
				</div>
				<button
					className={`${styles.submitbutton}`}
					type="submit"
					disabled={isPending}
				>
					{isPending ? "Saving" : "Submit"}
				</button>
			</form>
		</dialog>
	);
}
