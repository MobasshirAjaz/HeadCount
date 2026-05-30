import * as z from "zod";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const isFileEmpty = (file: any) => {
	// 1. Catches undefined, null, empty strings, and the literal string "undefined"
	if (!file || file === "undefined" || file === "") return true;

	// 2. Catches the browser's 0-byte ghost file
	if (typeof file === "object" && "size" in file && file.size === 0)
		return true;

	// 3. Catches files named "undefined" (a common FormData artifact)
	if (typeof file === "object" && "name" in file && file.name === "undefined")
		return true;

	return false;
};

export const EventSchema = z.object({
	eventimage: z
		.any()
		// 1. Check if it's empty first (if optional)
		.refine((file) => !file || isFileEmpty(file) || file instanceof File, {
			message: "Expected a file.",
		})
		// 2. Validate Size
		.refine(
			(file) =>
				isFileEmpty(file) ||
				(file instanceof File && file.size <= MAX_SIZE),
			"Max file size is 5MB.",
		)
		// 3. Validate Type
		.refine(
			(file) =>
				isFileEmpty(file) ||
				(file instanceof File && ACCEPTED_TYPES.includes(file.type)),
			"Only JPG, PNG, WEBP formats are allowed.",
		)
		.optional(),
	eventname: z
		.string("Wrong input type received")
		.min(1, "Event name is required"),
	startdate: z.coerce.date("Invalid date received"),
	enddate: z.preprocess(
		(arg) => (arg === "" ? null : arg),
		z.coerce.date("Invalid date received").nullable(),
	),
});
