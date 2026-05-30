"use server";

import { EventSchema } from "@/lib/validations/event.schema";
import * as z from "zod";
import { NewEventState } from "@/lib/types/types";
import { Events } from "../../generated/prisma/client";
import { supabase } from "@/lib/supabase/supabase";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { uploadFile } from "@/lib/utils/uploadFile";

type formDataType = z.infer<typeof EventSchema>;

export const newEventServerAction = async (
	prevState: NewEventState,
	formData: formDataType,
	event: Events | null,
	parentevent: Events | null,
): Promise<NewEventState> => {
	"use server";
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
	const session = await auth();
	if (!session) {
		redirect("/signIn");
	}
	if (validated.data.eventimage) {
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
		if (event) {
			const updatedevent = await prisma.events.update({
				where: { id: event.id },
				data: {
					name: validated.data.eventname,
					startDate: validated.data.startdate,
					endDate: validated.data.enddate,
					image: fileurl ?? event.image,
					parent: parentevent?.id,
					createdBy: event.createdBy,
					updatedBy: session?.user.id,
				},
			});
		} else {
			const newevent = await prisma.events.create({
				data: {
					name: validated.data.eventname,
					startDate: validated.data.startdate,
					endDate: validated.data.enddate,
					image: fileurl,
					parent: parentevent?.id,
					createdBy: session?.user.id,
					updatedBy: session.user.id,
				},
			});

			if (!parentevent) {
				const newsubevent = await prisma.events.create({
					data: {
						name: newevent.name + " main",
						startDate: validated.data.startdate,
						endDate: validated.data.enddate,
						image: "/hero_image.jpg",
						parent: newevent.id,
						createdBy: session.user.id,
						updatedBy: session.user.id,
					},
				});
			}
		}

		revalidatePath("/events");
		revalidatePath("/events/[eventid]");
	} catch (err) {
		console.error("Failed to insert Event in database: ", err);
		const imagepath = fileurl?.split("/Events/").pop();
		if (imagepath) {
			const { data, error } = await supabase.storage
				.from("Events")
				.remove([imagepath]);

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
	};
};

export async function eventDeleteServerAction(event: Events) {
	"use server";
	if (!event.parent) {
		const childevents = await prisma.events.findMany({
			where: { parent: event.id },
		});
		for (const childevent of childevents) {
			await eventDeleteServerAction(childevent);
		}
	}
	if (event.image) {
		// Extract the path after the bucket name ("Events/")
		// If your URL is ".../public/Events/2026/party.jpg", this extracts "2026/party.jpg"
		const imagePath = event.image.split("/Events/").pop();

		if (imagePath) {
			const { data, error } = await supabase.storage
				.from("Events")
				.remove([imagePath]); // Pass the extracted path, not the full URL

			if (error) {
				console.log("Failed to delete image for ", event);
			} else if (data && data.length > 0) {
				console.log("Image deleted successfully : ", data);
			} else {
				console.log("File not found in bucket: ", imagePath);
			}
		}
	}
	const deleted = await prisma.events.delete({ where: { id: event.id } });
	if (deleted) {
		console.log("deleted successfully : ", event);
		revalidatePath("/events");
	}
}
