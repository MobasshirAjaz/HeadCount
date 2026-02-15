import { useMemo } from "react";
import styles from "./styles.module.scss";

function shuffle(arr: string[]) {
	const a = [...arr]; // copy so original isn't modified (optional)

	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]]; // swap
	}

	return a;
}

function Row({ taglist }: { taglist: { name: string; style: string }[] }) {
	return (
		<div className={`${styles.rowline}`}>
			{taglist.map((tag, idx) => {
				return (
					<span key={idx} className={`${styles.tag} ${tag.style}`}>
						{tag.name}
					</span>
				);
			})}
		</div>
	);
}

function createLine(taglist: string[]) {
	function shuffle<T>(arr: T[]): T[] {
		const a = [...arr];

		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]]; // swap
		}

		return a;
	}

	const shuffled = shuffle(taglist);
	return shuffled.map((tagname) => {
		const randomStyle =
			Math.random() < 0.5 ? styles.tagFilled : styles.tagHollow;
		return { name: tagname, style: randomStyle };
	});
}

export default function MarqueeSection() {
	const taglist = [
		"Family",
		"Friend",
		"Veg",
		"Kid",
		"Card",
		"Local",
		"Gift",
		"Non-veg",
		"VIP",
		"Halal",
		"Haram",
		"Office",
		"Neighbour",
		"Outstation",
		"Plus One",
		"Bride Side",
		"Groom Side",
		"Close Family",
		"Colleague",
		"Elder",
		"Student",
	];

	const line1 = useMemo(() => createLine(taglist), []);
	const line2 = useMemo(() => createLine(taglist), []);

	return (
		<section className={`${styles.outercontainer}`}>
			<div className={`${styles.textarea}`}>
				<h2>Tag them once. Find them fast.</h2>
				<p>
					Use tags to group guests by role, relationship, or anything
					you need.
				</p>
			</div>
			<div className={`${styles.marqueearea}`}>
				<div className={`${styles.combinedrows} ${styles.righttoleft}`}>
					<Row taglist={line1}></Row>
					<Row taglist={line1}></Row>
				</div>
				<div className={`${styles.combinedrows} ${styles.lefttoright}`}>
					<Row taglist={line2}></Row>
					<Row taglist={line2}></Row>
				</div>
			</div>
		</section>
	);
}
