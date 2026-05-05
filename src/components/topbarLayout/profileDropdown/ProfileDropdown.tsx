"use client";

import styles from "./styles.module.scss";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function ProfileDropdown({ isOpen }: { isOpen: Boolean }) {
	return (
		<div
			className={`${styles.dropdownmenu} ${isOpen ? styles.visible : ""}`}
		>
			<div
				onClick={() => {
					signOut();
				}}
			>
				Signout
			</div>
			<div>Settings</div>
		</div>
	);
}
