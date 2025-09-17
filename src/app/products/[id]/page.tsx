import { notFound } from "next/navigation";
import { getProducts } from "@/lib/shopify";
import ProductDetails from "@/components/ProductDetails";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  // Await params for Next.js 15 compatibility
  const { id } = await params;

  // Use cached products data for instant loading
  const products = await getProducts();

  const product = products.find((p) => {
    const numericId = p.id.split("/").pop() || p.id;
    return numericId === id || p.id === id;
  });

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

// Disable static generation for faster dynamic loading
export const dynamic = "force-dynamic";
