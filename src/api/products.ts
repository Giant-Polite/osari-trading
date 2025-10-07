// src/api/products.ts
import productsData from "@/data/products.json";

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  featured?: boolean;
  inStock?: boolean; // optional stock status
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

export const fetchCategories = async (): Promise<Category[]> => {
  return categories;
};

export const fetchProducts = async (): Promise<Product[]> => {
  return productsData;
};

export const fetchProductsByCategory = async (
  categorySlug: string
): Promise<Product[]> => {
  return productsData.filter((product) => product.category === categorySlug);
};

// Optionally, fetch a single product by ID
export const fetchProductById = async (
  id: string
): Promise<Product | null> => {
  return productsData.find((product) => product.id === id) || null;
};
