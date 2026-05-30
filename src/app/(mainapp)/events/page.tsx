import styles from "./styles.module.scss";
import { prisma } from "@/lib/db/prisma";
import { Events } from "../../../../generated/prisma/client";
import EventCard from "@/components/eventsPage/EventCard/page";
import AddEventSection from "@/components/eventsPage/AddEventSection/page";
import Link from "next/link";
import { auth } from "@/auth";

export default async function EventsPage() {
	const session = await auth();
	const events: Array<Events> = await prisma.events.findMany({
		where: { parent: null },
	});
	return (
		<div className={`${styles.outercontainer}`}>
			<AddEventSection events={events} parentevent={null} />
			<div className={`${styles.eventscontainer}`}>
				{events.map((event) => (
					<EventCard
						key={event.id}
						event={event}
						parentevent={null}
					></EventCard>
				))}
			</div>
		</div>
	);
}
