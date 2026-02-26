"use client";

import { useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import SideMenu from "./SideMenu";
export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	return (
		<header className={`${styles.navcontainer}`}>
			<nav className={styles.navbar} aria-label="main-navigation">
				<Link href={"/"} className={styles.logo}>
					HeadCount
				</Link>
				<div className={styles.navlinkscontainer}>
					<ul className={styles.links}>
						<li>
							<Link href={"/about"}>About</Link>
						</li>
						<li>
							<Link href={"/contact"}>Contact</Link>
						</li>
						<li>
							<Link href={"/signUp"} className={styles.signup}>
								Sign Up
							</Link>
						</li>
					</ul>
					<div className={styles.buttons}>
						<Link href={"/signIn"} className={styles.signin}>
							Sign In
						</Link>
						<button
							className={styles.hamburgericon}
							onClick={() => {
								setIsMenuOpen(true);
							}}
						>
							☰
						</button>
					</div>
				</div>
				<SideMenu isMenuOpen={isMenuOpen} setMenuOpen={setIsMenuOpen} />
			</nav>
		</header>
	);
}
