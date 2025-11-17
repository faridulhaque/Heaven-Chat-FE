
import About from "@/components/home/About";
import ExtraFeatures from "@/components/home/ExtraFeatures";
import Feature from "@/components/home/Feature";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import OnboardingModal from "@/components/home/OnboardingModal";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-auto" style={{ width: "95%" }}>
      <Hero></Hero>
      <Feature></Feature>
      <ExtraFeatures></ExtraFeatures>
      <About></About>
      <Footer></Footer>
      <OnboardingModal></OnboardingModal>
    </div>
  );
}
