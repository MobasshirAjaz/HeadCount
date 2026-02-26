import styles from "./styles.module.scss";
import Link from "next/link";

export default function SideMenu({
	isMenuOpen,
	setMenuOpen,
}: {
	isMenuOpen: Boolean;
	setMenuOpen: Function;
}) {
	return (
		<div className={`${styles.overlay} ${isMenuOpen ? styles.active : ""}`}>
			<aside
				className={`${styles.menu} ${isMenuOpen ? styles.active : ""}`}
			>
				<div className={`${styles.buttoncontainer}`}>
					<button onClick={() => setMenuOpen(false)}>X</button>
				</div>
				<ul
					className={`${styles.menulinks}`}
					onClick={() => setMenuOpen(false)}
				>
					<li>
						<Link href={"/"}>About</Link>
					</li>
					<li>
						<Link href={"/"}>Contact</Link>
					</li>
					<li>
						<Link href={"/signUp"}>Sign Up</Link>
					</li>
					<li>
						<Link href={"/signIn"}>Sign In</Link>
					</li>
				</ul>
			</aside>
		</div>
	);
}
