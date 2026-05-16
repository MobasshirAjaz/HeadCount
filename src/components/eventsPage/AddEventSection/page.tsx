"use client";
import styles from "./styles.module.scss";
import SearchBox from "../SearchBox/page";
import { Events } from "../../../../generated/prisma/client";
import { useState } from "react";
import { Plus } from "lucide-react";
import AddEventForm from "../AddEventForm/page";
import { NewEventState as State } from "@/lib/types/types";
import { EventSchema } from "@/lib/validations/event.schema";
import * as z from "zod";

type formDataType = z.infer<typeof EventSchema>;

export default function AddEventSection({
	events,
	serveraction,
}: {
	events: Array<Events>;
	serveraction: (prevState: State, formData: formDataType) => Promise<State>;
}) {
	const [isFormOpen, setIsFormOpen] = useState(false);
	return (
		<div className={`${styles.headercontainer}`}>
			<h1>Events</h1>
			<SearchBox events={events} />
			<button
				className={`${styles.addeventbutton}`}
				onClick={() => {
					setIsFormOpen(true);
				}}
			>
				<Plus /> New event
			</button>
			<AddEventForm
				open={isFormOpen}
				onClose={() => {
					setIsFormOpen(false);
				}}
				serveraction={serveraction}
			/>
		</div>
	);
}
