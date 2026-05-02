import StoreHeader from "@/components/layout/StoreHeader";
import HeroSection from "@/components/home/HeroSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <StoreHeader />
      <HeroSection />
    </main>
  );
}
