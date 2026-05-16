"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import styles from "./styles.module.scss";
import { Events } from "../../../../generated/prisma/client";

function search(events: Array<Events>, searchvalue: string) {
	const filtered: Array<Events> = events.filter((event) => {
		const ismainevent = !event.parent;
		const matches = event.name
			.toLowerCase()
			.startsWith(searchvalue.toLowerCase());
		return ismainevent && matches && searchvalue != "";
	});
	return filtered;
}

export default function SearchBox({ events }: { events: Array<Events> }) {
	const [searchvalue, setSearchValue] = useState("");
	const [searchResults, setSearchResults] = useState<Array<Events>>([]);
	useEffect(() => {
		const filtered = search(events, searchvalue);
		setSearchResults(filtered);
		console.log(filtered);
	}, [searchvalue]);
	return (
		<>
			<div className={`${styles.searchcontainer}`}>
				<div style={{ display: "block" }}>
					{searchResults.map((event) => (
						<p key={event.id}>{event.name}</p>
					))}
				</div>
				<input
					className={`${styles.searchbox}`}
					type="text"
					placeholder="Search Events"
					value={searchvalue}
					onChange={(e) => setSearchValue(e.target.value)}
				/>
				<button className={`${styles.searchbutton}`}>
					<Search />
				</button>
			</div>
		</>
	);
}
