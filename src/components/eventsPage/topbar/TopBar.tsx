import { User } from "next-auth";
import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import path from "path";

export default function TopBar({ user }: { user: User }) {
	console.log("topbar user:", user);
	return (
		<div className={`${styles.outercontainer}`}>
			<div className={`${styles.topbarcontainer}`}>
				<Link href={"/events"}>
					<span className={`${styles.logo}`}>HeadCount</span>
				</Link>
				<div
					className={`${styles.avatararea}`}
					title={user.username || user.email || "user"}
				>
					<Image
						src={
							user.image
								? `/uploads/${user.image}`
								: "https://wallpapers.com/images/featured-full/cool-profile-picture-87h46gcobjl5e4xu.jpg"
						}
						alt="Profile picture"
						width={30}
						height={30}
						unoptimized
					></Image>
				</div>
			</div>
		</div>
	);
}
