import { useQuery } from "@tanstack/react-query";
import productsData from "@/data/products.json";

// --- Product type (now includes optional fields for modal) ---
export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  origin?: string; // ✅ optional, used in modal
  detailedDescription?: string; // ✅ optional, used in modal
  uses?: string[]; // ✅ optional, used in modal
}

// --- Category type ---
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

// --- Helper: format category names ---
const formatCategoryName = (slug: string): string => {
  const words = slug.split("-").map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  // ✅ Keep "Cooking Essential Oils" as is
  if (slug === "cooking-essential-oils") {
    return "Cooking Essential Oils";
  }

  // ✅ If there are exactly 2 words, join them with &
  if (words.length === 2) {
    return `${words[0]} & ${words[1]}`;
  }

  // ✅ For 3+ words, just join with spaces (or could use commas/& if desired)
  return words.join(" ");
};

// --- Generate categories dynamically from products ---
export const categories: Category[] = Array.from(
  new Set(productsData.map((p) => p.category))
).map((slug, index) => {
  const product = productsData.find((p) => p.category === slug)!;
  const formattedName = formatCategoryName(slug);

  return {
    id: String(index + 1),
    name: formattedName,
    slug,
    image: product.image,
    description: `${formattedName} products`,
  };
});

// --- React Query hooks ---
export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => productsData,
  });
};

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => categories,
  });
};

// --- Optional featured products hook ---
export const useFeaturedProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["featuredProducts"],
    queryFn: async () => [], // No featured products currently
  });
};
