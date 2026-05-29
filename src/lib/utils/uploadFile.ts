import { Session } from "next-auth";
import { supabase } from "../supabase/supabase";

function isFileEmpty(file?: File | null) {
	if (!file) return true;
	if (file.size === 0) return true;
	if (file.name === "undefined") return true;

	return false;
}

export async function uploadFile(
	session: Session,
	file: File,
	bucket: string,
): Promise<string> {
	if (isFileEmpty(file)) {
		return "";
	}

	const originalName = file.name;
	const timestamp = Date.now();
	const uid = session?.user.id;

	const newfilename = `${uid}-${timestamp}-${originalName}`;
	const filepath = `uploads/${newfilename}`;

	const { data, error } = await supabase.storage
		.from(bucket)
		.upload(filepath, file);
	if (error) {
		throw new Error("Failed to upload file:", error);
	} else {
		const { data } = supabase.storage.from(bucket).getPublicUrl(filepath);
		return data.publicUrl;
	}
}
