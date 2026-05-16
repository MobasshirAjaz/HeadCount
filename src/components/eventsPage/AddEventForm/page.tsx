"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import * as z from "zod";
import { EventSchema } from "@/lib/validations/event.schema";
import { NewEventState as State } from "@/lib/types/types";

type formDataType = z.infer<typeof EventSchema>;

export default function AddEventForm({
	open,
	onClose,
	serveraction,
}: {
	open: boolean;
	onClose: () => void;
	serveraction: (prevState: State, formData: formDataType) => Promise<State>;
}) {
	async function serverActionProxy(
		prevState: State,
		formData: FormData,
	): Promise<State> {
		const fielddata = Object.fromEntries(formData);
		console.log("frontend received: ", fielddata);
		const validated = EventSchema.safeParse(fielddata);
		console.log("frontend validated", validated);
		if (!validated.success) {
			const flattened = z.flattenError(validated.error);
			return {
				data: {
					eventimgurl: prevState.data?.eventimgurl || "",
					eventName: prevState.data?.eventName || "",
					startDate: prevState.data?.startDate || "",
					endDate: prevState.data?.endDate || "",
				},
				error: {
					message:
						flattened.fieldErrors.eventname?.[0] ||
						flattened.fieldErrors.eventimage?.[0] ||
						flattened.fieldErrors.enddate?.[0] ||
						flattened.fieldErrors.startdate?.[0] ||
						"Something went wrong",
				},
			};
		}
		console.log("called backend");
		const receivedState = await serveraction(prevState, validated.data);
		console.log("received state=", receivedState);
		return receivedState;
	}
	const dialogRef = useRef<HTMLDialogElement>(null);
	useEffect(() => {
		const d = dialogRef.current;
		if (!d) return;

		if (open) {
			d.showModal();
		} else {
			d.close();
		}
	}, [open]);

	const eventimgref = useRef<HTMLInputElement>(null);

	const initialState: State = {
		data: {
			eventimgurl: "/hero_image.jpg",
			eventName: "",
			startDate: new Date().toISOString().slice(0, 10), // "YYYY-MM-DD"
			endDate: "",
		},
		error: {
			message: "",
		},
	};

	const [state, actionfn, isPending] = useActionState(
		serverActionProxy,
		initialState,
	);
	const [previewUrl, setPreviewUrl] = useState(
		initialState.data?.eventimgurl,
	);

	function handleUploadClick() {
		eventimgref.current?.click();
	}

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		console.log("file changed");
		const file = eventimgref.current?.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	}
	return (
		<dialog className={`${styles.eventdialog}`} ref={dialogRef}>
			<form className={`${styles.addeventform}`} action={actionfn}>
				<div className={`${styles.imagesection}`}>
					<Image
						width={200}
						height={100}
						alt="event image"
						src={previewUrl || "/hero_image.jpg"}
					></Image>
					<div className={`${styles.imagebuttonsection}`}>
						<input
							name="eventimage"
							type="file"
							style={{ display: "none" }}
							ref={eventimgref}
							onChange={(e) => {
								handleFileChange(e);
							}}
						/>
						<button
							type="button"
							className={`${styles.uploadbtn}`}
							onClick={handleUploadClick}
						>
							upload
						</button>
						<button
							type="button"
							className={`${styles.removebtn}`}
							onClick={() => {
								setPreviewUrl(initialState.data?.eventimgurl);
								eventimgref.current &&
									(eventimgref.current.value = "");
							}}
						>
							remove
						</button>
					</div>
				</div>

				<div className={`${styles.inputsection}`}>
					<input
						className={`${styles.eventname}`}
						type="text"
						placeholder="Event name"
						maxLength={17}
						defaultValue={state.data?.eventName}
						name="eventname"
					/>
					<div className={`${styles.datesection}`}>
						<div className={`${styles.singledate}`}>
							<label htmlFor="startdate">Start date</label>
							<input
								className={`${styles.datefield}`}
								name="startdate"
								type="date"
								defaultValue={state.data?.startDate}
							/>
						</div>
						<div className={`${styles.singledate}`}>
							<label htmlFor="enddate">End date</label>
							<input
								className={`${styles.datefield}`}
								name="enddate"
								type="date"
								defaultValue={state.data?.endDate}
							/>
						</div>
					</div>

					<p>{state.error?.message}</p>

					<div className={`${styles.buttonarea}`}>
						<button
							type="submit"
							className={`${styles.createbtn}`}
							disabled={isPending}
						>
							Create
						</button>
						<button
							type="button"
							onClick={onClose}
							className={`${styles.discardbtn}`}
							disabled={isPending}
						>
							Discard
						</button>
					</div>
				</div>
			</form>
		</dialog>
	);
}
