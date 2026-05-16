import { Events } from "../../../../generated/prisma/client";
import styles from "./styles.module.scss";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";

export default function EventCard({ event }: { event: Events }) {
	return (
		<div className={`${styles.cardcontainer}`}>
			<Image
				src={event.image ? event.image : "/hero_image.jpg"}
				alt="event image"
				width={200}
				height={100}
			></Image>
			<div className={`${styles.eventdetailscontainer}`}>
				<h3 className={`${styles.eventname}`}>{event.name}</h3>
				<div className={`${styles.datecontainer}`}>
					<p className={`${styles.date}`}>{String(event.date)}</p>
					<EllipsisVertical />
				</div>
			</div>
		</div>
	);
}
