"use client";
import styles from "./styles.module.scss";
import SearchBox from "../SearchBox/page";
import { Events } from "../../../../generated/prisma/client";
import { useState } from "react";
import { Plus } from "lucide-react";
import AddEventForm from "../AddEventForm/page";

export default function AddEventSection({
	events,
	parentevent,
}: {
	events: Array<Events>;
	parentevent: Events | null;
}) {
	const [isFormOpen, setIsFormOpen] = useState(false);
	return (
		<div className={`${styles.headercontainer}`}>
			<h1>{parentevent ? parentevent.name : "Events"}</h1>
			<SearchBox events={events} />
			<button
				className={`${styles.addeventbutton}`}
				onClick={() => {
					setIsFormOpen(true);
				}}
			>
				<Plus /> {parentevent ? "New subevent" : "New event"}
			</button>
			<AddEventForm
				key={isFormOpen ? "new" : "closed"}
				open={isFormOpen}
				onClose={() => {
					setIsFormOpen(false);
				}}
				event={null}
				parentevent={parentevent}
			/>
		</div>
	);
}
