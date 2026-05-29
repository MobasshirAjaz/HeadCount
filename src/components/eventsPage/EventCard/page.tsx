import { Events } from "../../../../generated/prisma/client";
import ThreeDotmenu from "../threeDotMenu/page";
import styles from "./styles.module.scss";
import Image from "next/image";

export default function EventCard({
	event,
	parentevent,
}: {
	event: Events;
	parentevent: Events | null;
}) {
	const startDateObj = new Date(event.startDate);
	const endDateObj = event.endDate && new Date(event.endDate);
	const formattedStartDate = startDateObj.toLocaleDateString("en-GB");
	const formattedEndDate = endDateObj
		? endDateObj.toLocaleDateString("en-GB")
		: null;
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
					<p className={`${styles.date}`}>{formattedStartDate}</p>
					{formattedEndDate && (
						<p className={`${styles.date}`}>- {formattedEndDate}</p>
					)}
					<ThreeDotmenu eventCard={event} parentevent={parentevent} />
				</div>
			</div>
		</div>
	);
}
