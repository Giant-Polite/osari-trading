// src/api/products.ts
export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  featured?: boolean;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

// ✅ Use environment variable (set in .env)
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://osari-trading-backend.onrender.com/api/products"; // we'll use this after deployment

// ✅ Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

// ✅ Add new product
export const addProduct = async (product: Product): Promise<void> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to add product");
};

// ✅ Update product
export const updateProduct = async (
  id: string,
  updatedData: Partial<Product>
): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error("Failed to update product");
};

// ✅ Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
};
