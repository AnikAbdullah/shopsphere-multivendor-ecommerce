import HeroBanner from "@/components/home/HeroBanner";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import PromoGrid from "@/components/home/PromoGrid";
import PopularProducts from "@/components/home/PopularProducts";
import BottomDealBanner from "@/components/home/BottomDealBanner";

export default function HeroSection() {
  return (
    <section className="bg-white px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <HeroBanner />
        <CategoryShowcase />
        <PromoGrid />
        <PopularProducts />
        <BottomDealBanner />
      </div>
    </section>
  );
}
