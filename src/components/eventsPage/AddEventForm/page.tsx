"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import * as z from "zod";
import { EventSchema } from "@/lib/validations/event.schema";
import { NewEventState as State } from "@/lib/types/types";
import { Events } from "../../../../generated/prisma/browser";
import { newEventServerAction } from "@/actions/eventsactions";

export default function AddEventForm({
	open,
	onClose,
	event,
	parentevent,
}: {
	open: boolean;
	onClose: () => void;
	event: Events | null;
	parentevent: Events | null;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const eventimgref = useRef<HTMLInputElement>(null);

	async function serverActionProxy(
		prevState: State,
		formData: FormData,
	): Promise<State> {
		const fielddata = Object.fromEntries(formData);
		const validated = EventSchema.safeParse(fielddata);

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
		const receivedState = await newEventServerAction(
			prevState,
			validated.data,
			event,
			parentevent,
		);
		if (!receivedState.error) {
			if (eventimgref.current) {
				setPreviewUrl("/hero_image.jpg");
				eventimgref.current.value = "";
			}
			onClose();
		}
		return receivedState;
	}

	useEffect(() => {
		const d = dialogRef.current;
		if (!d) return;

		if (open) {
			d.showModal();
		} else {
			d.close();
		}
	}, [open]);

	console.log("inside form:", event);
	const initialState: State = {
		data: {
			eventimgurl: event?.image || "/hero_image.jpg",
			eventName: event?.name || "",
			startDate: event?.startDate
				? new Date(event.startDate).toISOString().slice(0, 10)
				: new Date().toISOString().slice(0, 10), // "YYYY-MM-DD"
			endDate: event?.endDate
				? new Date(event.endDate).toISOString().slice(0, 10)
				: "",
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
						className={`${styles.eventimg}`}
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
						placeholder={
							parentevent ? "Subevent name" : "Event name"
						}
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
							{event ? "Update" : "Create"}
						</button>
						<button
							type="button"
							onClick={onClose}
							className={`${styles.discardbtn}`}
							disabled={isPending}
						>
							Cancel
						</button>
					</div>
				</div>
			</form>
		</dialog>
	);
}
