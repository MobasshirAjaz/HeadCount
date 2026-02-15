import "../styles/globals.scss";
import { Montserrat } from "next/font/google";
import { Pacifico } from "next/font/google";

const montserrat = Montserrat({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-montserrat", // This creates a CSS variable
});

const pacifico = Pacifico({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-pacifico",
	weight: "400",
});

export const metadata = {
	title: "HeadCount",
	description: "Application to make guest lists",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${montserrat.variable} ${pacifico.variable}`}
		>
			<body>{children}</body>
		</html>
	);
}
