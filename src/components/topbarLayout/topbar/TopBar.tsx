import { User } from "next-auth";
import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import Avatar from "../avatar/Avatar";

export default function TopBar({ user }: { user: User }) {
	console.log("topbar user:", user);
	return (
		<div className={`${styles.outercontainer}`}>
			<div className={`${styles.topbarcontainer}`}>
				<Link href={"/events"}>
					<span className={`${styles.logo}`}>HeadCount</span>
				</Link>
				<Avatar user={user}></Avatar>
			</div>
		</div>
	);
}
