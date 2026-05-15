import Hero from "@/src/components/home/Hero";
import ProductSection from "@/src/components/home/ProductSection";
import CategorySection from "@/src/components/home/CategorySection";
import FeatureSection from "@/src/components/home/FeatureSection";
import Newsletter from "@/src/components/home/Newsletter";
import TrendingNowSection from "../components/home/TrendingNowSection";
import RecentlyViewedSection from "../components/home/RecentlyViewedSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductSection />
      <CategorySection />
      <TrendingNowSection />
      <RecentlyViewedSection />
      <FeatureSection />
      <Newsletter />
    </>
  );
}