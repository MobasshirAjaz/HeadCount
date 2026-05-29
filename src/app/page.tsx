import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FilledSection from "@/components/root/FilledSection/page";
import FinalSection from "@/components/root/FinalSection/page";
import Footer from "@/components/root/Footer/page";
import HeroSection from "@/components/root/HeroSection/HeroSection";
import MarqueeSection from "@/components/root/MarqueeSection/MarqueeSection";
import Navbar from "@/components/root/navbar/Navbar";

export default async function Home() {
	const session = await auth();
	if (session) {
		redirect("/events");
	}
	return (
		<>
			<Navbar />
			<HeroSection />
			<FilledSection />
			<MarqueeSection />
			<FinalSection />
			<Footer />
		</>
	);
}
