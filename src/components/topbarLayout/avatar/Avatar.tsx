"use client";

import { User } from "next-auth";
import styles from "./styles.module.scss";
import Image from "next/image";
import { use, useState } from "react";
import ProfileDropdown from "../profileDropdown/ProfileDropdown";

export default function Avatar({ user }: { user: User }) {
	const [loaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const imageSrc = hasError ? "/user.png" : user?.image || "/user.png";

	return (
		<div className={`${styles.imagecontainer}`}>
			<ProfileDropdown isOpen={isOpen}></ProfileDropdown>
			<Image
				className={`${styles.avatarimage}`}
				width={40}
				height={40}
				alt="Avatar"
				src={imageSrc}
				title={user.username || user.email}
				style={{ opacity: !loaded ? "0%" : "100%" }}
				onLoad={() => setIsLoaded(true)}
				onClick={() => {
					setIsOpen(!isOpen);
				}}
				onError={() => {
					setHasError(true);
					setIsLoaded(true);
				}}
			></Image>
		</div>
	);
}
