import SignInBox from "@/components/signin_signup/signin_container/SignInBox";
import { LoginSchema } from "@/lib/validations/auth.schema";
import { redirect } from "next/navigation";
import * as z from "zod";
import { signIn } from "@/auth";
import { AuthError, CredentialsSignin } from "next-auth";

type State = {
	data?: {
		email?: string;
	};
	errors?: {
		email?: string;
		password?: string;
	};
	message?: string;
};

type FormDataType = z.infer<typeof LoginSchema>;
type ActionFn = (prevState: State, formData: FormDataType) => Promise<State>;

const signInActionfn: ActionFn = async (
	prevState: State,
	formData: FormDataType,
) => {
	"use server";
	const result = LoginSchema.safeParse(formData);
	if (!result.success) {
		const flattened = z.flattenError(result.error);
		return {
			data: {
				email: formData.email,
			},
			errors: {
				email: flattened.fieldErrors.email?.[0],
				password: flattened.fieldErrors.password?.[0],
			},
		};
	}

	try {
		const user = await signIn("credentials", {
			email: result.data.email,
			password: result.data.password,
			redirectTo: "/dashboard",
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return {
						data: { email: result.data.email },
						message: "Invalid Credentials.",
					};
				default:
					return {
						data: { email: result.data.email },
						message: "Something went wrong.",
					};
			}
		}

		// VERY IMPORTANT: If it's NOT an AuthError, you must throw it again.
		// This allows Next.js to process the successful redirect!
		throw error;
	}
	return {};
};
export default function SignIn() {
	return <SignInBox type="signin" actionFunction={signInActionfn} />;
}
