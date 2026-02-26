"use client";

import { useActionState, useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { LoginSchema } from "@/lib/validations/auth.schema";
import { SignUpSchema } from "@/lib/validations/auth.schema";
import * as z from "zod";

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

type ActionfnType = (
	prevState: State,
	formData: FormDataType,
) => Promise<State>;

export default function SignInBox({
	type,
	actionFunction,
}: {
	type: string;
	actionFunction: ActionfnType;
}) {
	const actionFunctionProxy = async (
		prevState: State,
		formData: FormData,
	) => {
		const fielddata = Object.fromEntries(formData.entries());
		console.log("data= ", fielddata);
		const result =
			type == "signin"
				? LoginSchema.safeParse(fielddata)
				: SignUpSchema.safeParse(fielddata);
		if (!result.success) {
			const flattened = z.flattenError(result.error);
			console.log("Flattened frontend= ", flattened);
			const newstate: State = {
				data: {
					email: fielddata.email?.toString(),
				},
				errors: {
					email: flattened.fieldErrors.email?.[0],
					password: flattened.fieldErrors.password?.[0],
				},
			};
			return newstate;
		}

		return await actionFunction(prevState, result.data);
	};
	const [showPassword, setShowPassword] = useState(false);
	const initialstate: State = {
		data: {
			email: "",
		},
		errors: {
			email: "",
			password: "",
		},
		message: "",
	};
	const [state, actionfn, isPending] = useActionState(
		actionFunctionProxy,
		initialstate,
	);

	return (
		<div className={`${styles.outercontainer}`}>
			<div className={`${styles.innercontainer}`}>
				<div className={`${styles.signinbox}`}>
					<div className={`${styles.topbar}`}>
						<span className={`${styles.signtype}`}>
							{type === "signin" ? "Sign In" : "Sign Up"}
						</span>
						<span className={`${styles.logo}`}>HeadCount</span>
					</div>
					<p className={`${styles.inputmessage}`}>{state?.message}</p>
					<form className={`${styles.inputarea}`} action={actionfn}>
						<div className={`${styles.inputfield}`}>
							<label htmlFor="email">Email</label>
							<input
								name="email"
								className={`${styles.textbox} ${styles.emailtextbox} ${state?.errors?.email ? styles.fielderror : ""}`}
								type="email"
								defaultValue={state.data?.email}
							/>
							<div className={`${styles.messagearea}`}>
								<span className={`${styles.inputmessage}`}>
									{state?.errors?.email}
								</span>
							</div>
						</div>
						<div className={`${styles.inputfield}`}>
							<label htmlFor="password">Password</label>
							<div className={`${styles.pswdarea}`}>
								<input
									name="password"
									className={`${styles.textbox} ${styles.pswdtextbox} ${state?.errors?.password ? styles.fielderror : ""}`}
									type={showPassword ? "text" : "password"}
								/>
								<button
									className={`${styles.pswdviewtoggle}`}
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
								>
									{showPassword ? "@" : "#"}
								</button>
							</div>

							<div className={`${styles.messagearea}`}>
								<span className={`${styles.inputmessage}`}>
									{state?.errors?.password}
								</span>
								<Link
									href="/"
									className={`${styles.forgotpassword}`}
								>
									Forgot Password
								</Link>
							</div>
						</div>

						<button
							className={`${styles.submitbutton}`}
							type="submit"
							disabled={isPending}
						>
							{type === "signin" ? "Sign In" : "Sign Up"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
