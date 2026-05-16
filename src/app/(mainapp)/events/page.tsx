import styles from "./styles.module.scss";
import { prisma } from "@/lib/db/prisma";
import { Events } from "../../../../generated/prisma/client";
import EventCard from "@/components/eventsPage/EventCard/page";
import AddEventSection from "@/components/eventsPage/AddEventSection/page";
import { NewEventState as State } from "@/lib/types/types";
import { EventSchema } from "@/lib/validations/event.schema";
import * as z from "zod";
import { uploadFile } from "@/lib/utils/uploadFile";
import { supabase } from "@/lib/supabase/supabase";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type formDataType = z.infer<typeof EventSchema>;

const serveraction = async (
	prevState: State,
	formData: formDataType,
): Promise<State> => {
	"use server";
	console.log("received backend:", formData);
	const validated = EventSchema.safeParse(formData);
	if (!validated.success) {
		const flattened = z.flattenError(validated.error);
		return {
			data: {
				eventimgurl: prevState.data?.eventimgurl || "/hero_image.jpg",
				eventName: prevState.data?.eventName || "New Event",
				startDate:
					prevState.data?.startDate || new Date().toISOString(),
				endDate: prevState.data?.endDate || new Date().toISOString(),
			},
			error: {
				message:
					flattened.fieldErrors.eventname?.[0] ||
					flattened.fieldErrors.eventimage?.[0] ||
					flattened.fieldErrors.enddate?.[0] ||
					flattened.fieldErrors.startdate?.[0],
			},
		};
	}

	let fileurl: string | null = "";
	if (validated.data.eventimage) {
		const session = await auth();
		if (!session) {
			redirect("/signIn");
		}
		try {
			fileurl = await uploadFile(
				session,
				validated.data.eventimage,
				"Events",
			);
			fileurl = fileurl === "" ? null : fileurl;
		} catch (error) {
			console.error("Failed to upload event image: ", error);
		}
	}

	try {
		const newevent = await prisma.events.create({
			data: {
				name: validated.data.eventname,
				startDate: validated.data.startdate,
				endDate: validated.data.enddate,
				image: fileurl,
			},
		});
	} catch (err) {
		console.error("Failed to insert Event in database: ", err);
		if (fileurl) {
			const { data, error } = await supabase.storage
				.from("Events")
				.remove([fileurl]);

			if (error) {
				console.error("Error deleting file:", error);
			} else {
				console.log("Deleted orphaned file successfully:", data);
			}
		}
	}

	return {
		data: {
			eventimgurl: "/hero_image.jpg",
			eventName: "",
			startDate: new Date().toISOString().slice(0, 10),
			endDate: "",
		},
		error: {
			message: "",
		},
	};
};

export default async function EventsPage() {
	const events: Array<Events> = await prisma.events.findMany();
	return (
		<div className={`${styles.outercontainer}`}>
			<AddEventSection events={events} serveraction={serveraction} />
			<div className={`${styles.eventscontainer}`}>
				{events.map((event) => (
					<EventCard key={event.id} event={event}></EventCard>
				))}
			</div>
		</div>
	);
}
