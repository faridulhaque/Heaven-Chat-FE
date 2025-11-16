import About from "@/components/About";
import ExtraFeatures from "@/components/ExtraFeatures";
import Feature from "@/components/Feature";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-auto" style={{ width: "95%" }}>
      <Hero></Hero>
      <Feature></Feature>
      <ExtraFeatures></ExtraFeatures>
      <About></About>
      <Footer></Footer>
    </div>
  );
}
