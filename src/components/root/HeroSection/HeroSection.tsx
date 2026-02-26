import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HeroSection() {
	const t = useTranslations("LandingPage");
	return (
		<section className={`${styles.herocontainer}`}>
			<div className={`${styles.innerherocontainer}`}>
				<div className={`${styles.textarea}`}>
					<h1>{t("HeroHeading")}</h1>
					<p>
						Create events, build guest lists with your family, and
						keep things organized without the group chat meltdown.
					</p>
					<button className={`${styles.getstartedbutton}`}>
						<Link href="/signUp">Get Started</Link>
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
