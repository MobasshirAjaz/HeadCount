interface PageProps {
	params: Promise<{ eventid: string; subeventid: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
	const resolvedparams = await params;
	const eventid = resolvedparams.eventid;
	const subeventid = resolvedparams.subeventid;
	return (
		<h1>
			Main page Event= {eventid} and subevent= {subeventid}{" "}
		</h1>
	);
}
