"use client";

import { EllipsisVertical, Trash2, Edit2 } from "lucide-react";
import styles from "./styles.module.scss";
import { useRef, useState, useEffect } from "react";
import { Events } from "../../../../generated/prisma/browser";
import AddEventForm from "../AddEventForm/page";
import { eventDeleteServerAction } from "@/actions/eventsactions";

export default function ThreeDotmenu({
	eventCard,
	parentevent,
}: {
	eventCard: Events;
	parentevent: Events | null;
}) {
	async function handleDelete() {
		await eventDeleteServerAction(eventCard);
	}
	const [menuOpen, setmenuOpen] = useState(false);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// 2. Define the click handler
		const handleClickOutside = (event: MouseEvent) => {
			// If the menu is open AND the clicked element is NOT inside the menu ref...
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setmenuOpen(false); // ...close the menu!
			}
		};

		// 3. Attach the event listener to the whole document when the menu is open
		if (menuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		// 4. CRITICAL: Clean up the event listener when the component unmounts or closes
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [menuOpen]); // Only re-run the effect if isOpen changes
	return (
		<div
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<div className={`${styles.outercontainer}`} ref={menuRef}>
				<EllipsisVertical
					className={`${styles.threedoticon}`}
					onClick={() => {
						setmenuOpen(!menuOpen);
					}}
				/>
				<div
					className={`${styles.menucontainer} ${!menuOpen ? styles.hidden : ""}`}
				>
					<div
						className={`${styles.menuitem}`}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleDelete();
						}}
					>
						<Trash2 className={`${styles.menuicon}`} />
						<p>Delete</p>
					</div>
					<div
						className={`${styles.menuitem}`}
						onClick={() => {
							setIsFormOpen(true);
						}}
					>
						<Edit2 className={`${styles.menuicon}`} />
						<p>Edit</p>
					</div>
				</div>
			</div>

			<AddEventForm
				key={`${eventCard?.id ?? "new"}-${isFormOpen ? "open" : "closed"}`}
				open={isFormOpen}
				onClose={() => {
					setIsFormOpen(false);
				}}
				event={eventCard}
				parentevent={parentevent}
			/>
		</div>
	);
}
