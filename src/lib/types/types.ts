export type NewEventState = {
	data?: {
		eventimgurl: string;
		eventName: string;
		startDate: string;
		endDate?: string;
	};
	error?: {
		message?: string;
	};
};
