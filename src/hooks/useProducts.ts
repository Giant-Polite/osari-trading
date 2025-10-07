import { useQuery } from "@tanstack/react-query";
import productsData from "@/data/products.json";

// Product type matches your JSON
export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

// Generate categories dynamically from products
export const categories: Category[] = Array.from(
  new Set(productsData.map((p) => p.category))
).map((slug, index) => {
  const product = productsData.find((p) => p.category === slug)!;
  return {
    id: String(index + 1),
    name: slug.replace(/-/g, " "),
    slug,
    image: product.image,
    description: `${slug.replace(/-/g, " ")} products`,
  };
});

// --- Fetch hooks using react-query ---
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

// Optional: Featured products — you don’t have this in your JSON, so return empty array
export const useFeaturedProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["featuredProducts"],
    queryFn: async () => [], // No featured products in your JSON
  });
};
