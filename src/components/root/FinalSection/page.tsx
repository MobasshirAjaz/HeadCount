import styles from "./styles.module.scss";
import Image from "next/image";
export default function FinalSection() {
	return (
		<section className={`${styles.outercontainer}`}>
			<div className={`${styles.innercontainer}`}>
				<div className={`${styles.textarea}`}>
					<h2>Everyone gets a Say</h2>
					<p>
						Build the guest list together and avoid the “why wasn’t
						I invited?” moment.
					</p>
					<button className={`${styles.getstartedbutton}`}>
						Get Started
					</button>
				</div>
				<div className={`${styles.imagearea}`}>
					<Image
						src={"/multieditfull.png"}
						className={`${styles.img}`}
						alt="Different people adding guests"
						width={500}
						height={200}
					></Image>
				</div>
			</div>
		</section>
	);
}
