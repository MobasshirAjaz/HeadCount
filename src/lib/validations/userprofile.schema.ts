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

export const UsernameModalSchema = z.object({
	username: z
		.string("wrong type input received")
		.min(1, "username is required"),
	image: z
		.instanceof(File)
		.refine(
			(file) => isFileEmpty(file) || file?.size <= MAX_SIZE,
			"Max file size is 5MB.",
		)
		.refine(
			(file) => isFileEmpty(file) || ACCEPTED_TYPES.includes(file?.type),
			"Only JPG, PNG, WEBP, and GIF formats are allowed.",
		),
});
