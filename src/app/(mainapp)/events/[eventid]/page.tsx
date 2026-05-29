import { prisma } from "@/lib/db/prisma";
import styles from "./styles.module.scss";
import AddEventSection from "@/components/eventsPage/AddEventSection/page";
import Link from "next/link";
import EventCard from "@/components/eventsPage/EventCard/page";
import { auth } from "@/auth";

interface PageProps {
	params: Promise<{ eventid: string }>;
}

export default async function SubEventPage({ params }: PageProps) {
	const resolvedparams = await params;
	const eventid = resolvedparams.eventid;
	const session = await auth();
	const event = await prisma.events.findFirst({ where: { id: eventid } });
	const subevents = await prisma.events.findMany({
		where: { parent: eventid },
	});
	return (
		<div className={`${styles.outercontainer}`}>
			<AddEventSection events={subevents} parentevent={event} />
			<div className={`${styles.eventscontainer}`}>
				{subevents.map((subevent) => (
					<Link
						href={`./${event?.id}/${subevent.id}`}
						key={subevent.id}
					>
						<EventCard
							event={subevent}
							parentevent={event}
						></EventCard>
					</Link>
				))}
			</div>
			<footer className={`${styles.footer}`}></footer>
		</div>
	);
}
