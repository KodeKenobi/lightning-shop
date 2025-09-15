import App from "@/components/App";
import { getHeroContent } from "@/lib/sanity";
import { getProducts } from "@/lib/shopify";

export default async function HomePage() {
  // Pre-fetch all data server-side
  const [heroData, productsData] = await Promise.all([
    getHeroContent(),
    getProducts(),
  ]);

  return (
    <App
      initialHeroData={heroData || undefined}
      initialProductsData={productsData}
    />
  );
}
