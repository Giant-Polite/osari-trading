// src/hooks/useProducts.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import productsData from "@/data/products.json";

// --- Product type ---
export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  origin?: string;
  detailedDescription?: string;
  uses?: string[];
  price?: number;
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

  if (slug === "cooking-essential-oils") {
    return "Cooking Essential Oils";
  }

  if (words.length === 2) {
    return `${words[0]} & ${words[1]}`;
  }

  return words.join(" ");
};

// --- LocalStorage utilities ---
const getStoredProducts = (): Product[] => {
  if (typeof window === "undefined") return productsData;
  const stored = localStorage.getItem("products");
  if (stored) {
    try {
      return JSON.parse(stored) as Product[];
    } catch {
      return productsData;
    }
  }
  localStorage.setItem("products", JSON.stringify(productsData));
  return productsData;
};

const saveProductsToStorage = (products: Product[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("products", JSON.stringify(products));
  }
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

// --- Hook: useProducts ---
export const useProducts = () => {
  const queryClient = useQueryClient();

  const query = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => getStoredProducts(),
  });

  const { data: products = [] } = query;

  // --- Helpers to manipulate products ---
  const addProduct = (product: Product) => {
    const updated = [...products, product];
    saveProductsToStorage(updated);
    queryClient.setQueryData(["products"], updated);
  };

  const updateProduct = (updatedProduct: Product) => {
    const updated = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    saveProductsToStorage(updated);
    queryClient.setQueryData(["products"], updated);
  };

  const deleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    saveProductsToStorage(updated);
    queryClient.setQueryData(["products"], updated);
  };

  return { ...query, products, addProduct, updateProduct, deleteProduct };
};

// --- Hook: useCategories ---
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const products = getStoredProducts();
      return Array.from(new Set(products.map((p) => p.category))).map(
        (slug, index) => {
          const product = products.find((p) => p.category === slug)!;
          const formattedName = formatCategoryName(slug);
          return {
            id: String(index + 1),
            name: formattedName,
            slug,
            image: product.image,
            description: `${formattedName} products`,
          };
        }
      );
    },
  });
};

// --- Optional featured products hook ---
export const useFeaturedProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["featuredProducts"],
    queryFn: async () => [],
  });
};
