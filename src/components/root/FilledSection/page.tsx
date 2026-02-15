import styles from "./styles.module.scss";

export default function FilledSection() {
	return (
		<section className={`${styles.outercontainer}`}>
			<div className={`${styles.innercontainer}`}>
				<div className={`${styles.textarea}`}>
					<h2 className={`${styles.title}`}>
						The right guests at the right time
					</h2>
					<p>
						Create events and sub-events with separate guest
						lists—so everyone’s exactly where they should be.
					</p>
				</div>
				<div className={`${styles.imagearea}`}>
					<div className={styles.image}></div>
				</div>
			</div>
		</section>
	);
}
