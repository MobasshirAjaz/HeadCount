import SignInBox from "@/components/signin_signup/signin_container/SignInBox";
import { SignUpSchema } from "@/lib/validations/auth.schema";
import * as z from "zod";
import argon2 from "argon2";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/db/prisma";

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

type FormDataType = z.infer<typeof SignUpSchema>;
type ActionFn = (prevState: State, formData: FormDataType) => Promise<State>;

const signUpActionfn: ActionFn = async (
	prevState: State,
	formData: FormDataType,
) => {
	"use server";
	console.log("Sing Up:");
	console.log(formData);

	const result = SignUpSchema.safeParse(formData);
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
		const hashedPassword = await argon2.hash(result.data.password, {
			type: argon2.argon2id, // Use Argon2id specifically
			memoryCost: 65536, // 64MB - High resistance to GPU cracking
			timeCost: 3, // 3 iterations
			parallelism: 4, // Use 4 threads (standard for modern server CPUs)
		});
		console.log("Hashed password = ", hashedPassword);

		const newuser = await prisma.user.create({
			data: {
				email: result.data.email,
				password: hashedPassword,
			},
		});

		console.log("New user = ", newuser);
	} catch (err) {
		console.log(err);
	}

	return {
		message: "Invalid Credentials",
	};
};
export default function SignIn() {
	return <SignInBox type="signup" actionFunction={signUpActionfn} />;
}
