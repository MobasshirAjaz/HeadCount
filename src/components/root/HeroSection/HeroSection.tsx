import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
	return (
		<section className={`${styles.herocontainer}`}>
			<div className={`${styles.innerherocontainer}`}>
				<div className={`${styles.textarea}`}>
					<h1>Guest lists, minus the drama.</h1>
					<p>
						Create events, build guest lists with your family, and
						keep things organized without the group chat meltdown.
					</p>
					<button className={`${styles.getstartedbutton}`}>
						<Link href="/signup">Get Started</Link>
					</button>
				</div>
				<div className={`${styles.imagearea}`}>
					<Image
						src="/hero_image.jpg"
						alt="people eating together"
						fill
						className={`${styles.heroimage}`}
					></Image>
				</div>
			</div>
		</section>
	);
}
