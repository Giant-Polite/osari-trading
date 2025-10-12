import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { supabase } from "../supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, LogOut, Search, Filter, Edit2, Trash } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  description?: string;
  image: string;
  in_stock: boolean;
};

type Category = {
  id: string;
  name: string;
};

export default function AdminDashboard(): JSX.Element {
  const formRef = useRef<HTMLElement | null>(null);
  const categoryFormRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate(); // Added for redirect
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Added for auth state
  const [authLoading, setAuthLoading] = useState(true); // Added for auth check loading
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    image: "",
    in_stock: true,
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | "all">("all");
  const [loading, setLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.alert("You must be logged in to access the admin dashboard.");
          navigate("/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        window.alert("An error occurred. Please try logging in again.");
        navigate("/login");
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch products and categories from Supabase
  useEffect(() => {
    if (!isAuthenticated) return; // Skip if not authenticated
    const fetchData = async () => {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("name").order("name", { ascending: true }),
      ]);

      if (productsRes.error) {
        console.error("Fetch products error:", productsRes.error);
        window.alert(`Failed to fetch products: ${productsRes.error.message}`);
      } else {
        console.log("Fetched products:", productsRes.data);
        setProducts(productsRes.data || []);
      }

      if (categoriesRes.error) {
        console.error("Fetch categories error:", categoriesRes.error);
        window.alert(`Failed to fetch categories: ${categoriesRes.error.message}`);
      } else {
        const sortedCategories = categoriesRes.data
          .map((c) => c.name)
          .sort((a, b) => a.localeCompare(b));
        console.log("Fetched categories:", sortedCategories);
        setCategories(sortedCategories);
      }
      setLoading(false);
    };
    fetchData();
  }, [isAuthenticated]);

  const productCounts = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((category) => {
      map[category] = products.filter((p) => p.category === category).length;
    });
    console.log("Product counts:", map);
    return map;
  }, [products, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFormData({ name: e.target.value });
  };

  const clearProductForm = () => {
    setFormData({ id: "", name: "", category: "", description: "", image: "", in_stock: true });
    setEditingProductId(null);
    window.alert("Product form cleared.");
  };

  const clearCategoryForm = () => {
    setCategoryFormData({ name: "" });
    window.alert("Category form cleared.");
  };

  const validateProductForm = () => {
    if (!formData.name?.trim()) {
      window.alert("Product name is required.");
      return false;
    }
    if (!formData.category?.trim()) {
      window.alert("Category is required.");
      return false;
    }
    if (formData.image && !isValidUrl(formData.image)) {
      window.alert("Please enter a valid image URL.");
      return false;
    }
    return true;
  };

  const validateCategoryForm = () => {
    const name = categoryFormData.name.trim();
    if (!name) {
      window.alert("Category name is required.");
      return false;
    }
    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      window.alert("Category already exists.");
      return false;
    }
    return true;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    setLoading(true);
    try {
      if (editingProductId) {
        const { error } = await supabase
          .from("products")
          .update({
            name: formData.name,
            category: formData.category,
            description: formData.description,
            image: formData.image,
            in_stock: formData.in_stock,
          })
          .eq("id", editingProductId);

        if (error) throw error;
        window.alert("Product updated successfully.");
        clearProductForm();
      } else {
        const { error } = await supabase.from("products").insert([
          {
            name: formData.name,
            category: formData.category,
            description: formData.description,
            image: formData.image,
            in_stock: formData.in_stock,
          },
        ]);

        if (error) throw error;
        window.alert("Product added successfully.");
        clearProductForm();
      }
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setProducts(data || []);
    } catch (error: any) {
      console.error("Product submit error:", error);
      window.alert(`Failed to ${editingProductId ? "update" : "add"} product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      window.alert("Product deleted successfully.");
    } catch (error: any) {
      console.error("Delete error:", error);
      window.alert(`Failed to delete product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCategoryForm()) return;

    const name = categoryFormData.name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    setLoading(true);
    try {
      console.log("Adding category:", name);
      const { error } = await supabase.from("categories").insert([{ name }]);
      if (error) throw error;
      window.alert("Category added successfully.");
      setCategories((prev) => [...prev, name].sort((a, b) => a.localeCompare(b)));
      clearCategoryForm();
      const { data } = await supabase.from("categories").select("name").order("name", { ascending: true });
      setCategories(data?.map((c) => c.name).sort((a, b) => a.localeCompare(b)) || []);
    } catch (error: any) {
      console.error("Category submit error:", error);
      window.alert(`Failed to add category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: Product) => {
    setFormData({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description ?? "",
      image: p.image,
      in_stock: p.in_stock ?? true,
    });
    setEditingProductId(p.id);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategoryFilter === "all" || p.category === selectedCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategoryFilter]);

  const handleCategoryCardClick = (category: string) => {
    setSelectedCategoryFilter(category);
    const el = document.getElementById("product-list-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Show loading screen during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: "#F5E6D3" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Return null if not authenticated (redirect handled by useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "rgba(0, 0, 0, 0.6)",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      <header
        className="px-8 py-6 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, rgba(139, 111, 71, 0.4), rgba(212, 165, 116, 0.3))",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 215, 0, 0.2)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #D4A574, #8B6F47)",
              boxShadow: "0 4px 15px rgba(212, 165, 116, 0.3)",
            }}
          >
            <Package className="w-7 h-7" style={{ color: "#FFF8E7" }} />
          </div>
          <h1
            className="tracking-wide"
            style={{
              color: "#F5E6D3",
              fontFamily: "Georgia, serif",
            }}
          >
            Osari Trading Admin Panel
          </h1>
        </div>
        <Button
          onClick={() => supabase.auth.signOut().then(() => (window.location.href = "/"))}
          className="px-6 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg"
          style={{
            border: "2px solid #FFD700",
            color: "#FFD700",
            background: "transparent",
            boxShadow: "0 0 0 rgba(255, 215, 0, 0)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.5)";
            e.currentTarget.style.background = "rgba(255, 215, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 rgba(255, 215, 0, 0)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      <main className="px-8 py-8 max-w-7xl mx-auto space-y-8">
        {loading && (
          <div className="text-center text-[#F5E6D3]">Loading...</div>
        )}

        <section
          className="rounded-3xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(139, 111, 71, 0.5), rgba(212, 165, 116, 0.4))",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            animation: "fadeIn 0.4s ease-out",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              style={{
                color: "#F5E6D3",
                fontFamily: "Georgia, serif",
              }}
            >
              Products Overview
            </h2>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                background: "rgba(255, 215, 0, 0.2)",
                border: "1px solid rgba(255, 215, 0, 0.3)",
              }}
            >
              <Search className="w-5 h-5" style={{ color: "#FFD700" }} />
              <span style={{ color: "#F5E6D3" }}>{products.length} total products</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((category, index) => {
              const count = productCounts[category] || 0;
              return (
                <div
                  key={category}
                  className="rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 relative"
                  style={{
                    background: "linear-gradient(135deg, #8B6F47, #D4A574)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                  }}
                  onClick={() => handleCategoryCardClick(category)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(255, 215, 0, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
                  }}
                >
                  <h3 style={{ color: "#F5E6D3", fontFamily: "Georgia, serif" }}>{category}</h3>
                  <p style={{ color: "#FFF8E7", opacity: 0.9 }}>
                    {count} {count === 1 ? "Product" : "Products"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section
          ref={formRef}
          className="rounded-3xl p-8"
          style={{
            background: "linear-gradient(135deg, #8B6F47, #D4A574)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            animation: "slideUp 0.5s ease-out",
          }}
        >
          <h2
            className="mb-6"
            style={{
              color: "#F5E6D3",
              fontFamily: "Georgia, serif",
            }}
          >
            {editingProductId ? "Edit Product" : "Add New Product"}
          </h2>

          <form onSubmit={handleProductSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label style={{ color: "#FFF8E7" }}>Product Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border-0 rounded-xl"
                  style={{
                    background: "rgba(255, 248, 231, 0.9)",
                    color: "#8B6F47",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#FFF8E7" }}>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}
                  onOpenChange={(open) => {
                    if (open) {
                      window.scrollY; // Prevent scroll jump
                    }
                  }}
                >
                  <SelectTrigger
                    className="border-0 rounded-xl"
                    style={{
                      background: "rgba(255, 248, 231, 0.9)",
                      color: "#8B6F47",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#FFF8E7" }}>Image URL</Label>
              <Input
                name="image"
                type="url"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                className="border-0 rounded-xl"
                style={{
                  background: "rgba(255, 248, 231, 0.9)",
                  color: "#8B6F47",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#FFF8E7" }}>Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="border-0 rounded-xl resize-none"
                style={{
                  background: "rgba(255, 248, 231, 0.9)",
                  color: "#8B6F47",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#FFF8E7" }}>In Stock</Label>
              <input
                type="checkbox"
                name="in_stock"
                checked={formData.in_stock}
                onChange={handleInputChange}
                className="h-5 w-5 text-yellow-600"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="submit"
                className="flex-1 rounded-xl transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  color: "#8B6F47",
                  boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 6px 25px rgba(255, 215, 0, 0.6)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 215, 0, 0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {editingProductId ? "Update Product" : "Add Product"}
              </Button>
              <Button
                type="button"
                onClick={clearProductForm}
                variant="outline"
                className="rounded-xl transition-all duration-300"
                style={{
                  background: "#3C2F2F", // Rich brown color
                  border: "2px solid #3C2F2F",
                  color: "#F5E6D3",
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#4A3B3B";
                  e.currentTarget.style.borderColor = "#F5E6D3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#3C2F2F";
                  e.currentTarget.style.borderColor = "#3C2F2F";
                }}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </section>

        <section
          ref={categoryFormRef}
          className="rounded-3xl p-8"
          style={{
            background: "linear-gradient(135deg, #8B6F47, #D4A574)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            animation: "slideUp 0.5s ease-out",
          }}
        >
          <h2
            className="mb-6"
            style={{
              color: "#F5E6D3",
              fontFamily: "Georgia, serif",
            }}
          >
            Add New Category
          </h2>

          <form onSubmit={handleCategorySubmit} className="space-y-5">
            <div className="space-y-2">
              <Label style={{ color: "#FFF8E7" }}>Category Name</Label>
              <Input
                name="name"
                value={categoryFormData.name}
                onChange={handleCategoryInputChange}
                placeholder="e.g., Beverages"
                required
                className="border-0 rounded-xl"
                style={{
                  background: "rgba(255, 248, 231, 0.9)",
                  color: "#8B6F47",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="submit"
                className="flex-1 rounded-xl transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  color: "#8B6F47",
                  boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 6px 25px rgba(255, 215, 0, 0.6)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 215, 0, 0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Add Category
              </Button>
              <Button
                type="button"
                onClick={clearCategoryForm}
                variant="outline"
                className="rounded-xl transition-all duration-300"
                style={{
                  background: "#3C2F2F", // Rich brown color
                  border: "2px solid #3C2F2F",
                  color: "#F5E6D3",
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#4A3B3B";
                  e.currentTarget.style.borderColor = "#F5E6D3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#3C2F2F";
                  e.currentTarget.style.borderColor = "#3C2F2F";
                }}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </section>

        <section
          id="product-list-section"
          className="rounded-3xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(139, 111, 71, 0.8), rgba(212, 165, 116, 0.6))",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            animation: "slideUp 0.6s ease-out",
          }}
        >
          <h2
            className="mb-6"
            style={{
              color: "#F5E6D3",
              fontFamily: "Georgia, serif",
            }}
          >
            Product List
          </h2>

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "#8B6F47" }}
              />
              <Input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 border-0 rounded-xl"
                style={{
                  background: "rgba(255, 248, 231, 0.9)",
                  color: "#8B6F47",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            <div className="flex gap-3">
              <Select
                value={selectedCategoryFilter}
                onValueChange={(v) => setSelectedCategoryFilter(v as any)}
                onOpenChange={(open) => {
                  if (open) {
                    window.scrollY; // Prevent scroll jump
                  }
                }}
              >
                <SelectTrigger
                  className="w-48 border-0 rounded-xl flex items-center gap-2"
                  style={{
                    background: "rgba(255, 248, 231, 0.9)",
                    color: "#8B6F47",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchQuery || selectedCategoryFilter !== "all") && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategoryFilter("all");
                    window.alert("Filters cleared.");
                  }}
                  variant="outline"
                  className="px-4 py-2 rounded-xl transition-all duration-300"
                  style={{
                    background: "rgba(245, 230, 211, 0.2)",
                    border: "2px solid rgba(245, 230, 211, 0.4)",
                    color: "#F5E6D3",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(245, 230, 211, 0.3)";
                    e.currentTarget.style.borderColor = "#F5E6D3";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(245, 230, 211, 0.2)";
                    e.currentTarget.style.borderColor = "rgba(245, 230, 211, 0.4)";
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12" style={{ color: "#FFF8E7", opacity: 0.6 }}>
              <Package className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p>{products.length === 0 ? "No products yet. Add your first product above!" : "No products match your filters."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="rounded-2xl p-5 transition-shadow duration-300"
                  style={{
                    background: "rgba(255, 248, 231, 0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 215, 0, 0.2)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(255, 215, 0, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
                  }}
                >
                  <div className="relative">
                    <img
                      src={product.image || "https://via.placeholder.com/300x192"}
                      alt={product.name}
                      className="w-full h-48 object-contain rounded-2xl mb-4"
                      style={{
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                      }}
                      onError={(e) => {
                        console.error(`Image failed to load: ${product.image}`);
                        e.currentTarget.src = "https://via.placeholder.com/300x192";
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        onClick={() => startEdit(product)}
                        size="sm"
                        className="p-2 rounded-lg transition-all duration-300"
                        style={{
                          background: "rgba(255, 215, 0, 0.9)",
                          color: "#8B6F47",
                        }}
                        disabled={loading}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255, 215, 0, 1)";
                          e.currentTarget.style.transform = "scale(1.1)";
                          e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255, 215, 0, 0.9)";
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id)}
                        size="sm"
                        className="p-2 rounded-lg transition-all duration-300"
                        style={{
                          background: "rgba(255, 0, 0, 0.9)",
                          color: "#FFFFFF",
                        }}
                        disabled={loading}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255, 0, 0, 1)";
                          e.currentTarget.style.transform = "scale(1.1)";
                          e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 0, 0, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255, 0, 0, 0.9)";
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 style={{ color: "#F5E6D3", fontFamily: "Georgia, serif" }}>{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className="px-3 py-1 rounded-lg inline-block"
                      style={{
                        color: "#FFD700",
                        background: "rgba(255, 215, 0, 0.2)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {product.category}
                    </span>
                    <span
                      className="px-3 py-1 rounded-lg inline-block"
                      style={{
                        color: "#F5E6D3",
                        background: "rgba(245, 230, 211, 0.2)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {product.in_stock ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                  <p className="mt-3" style={{ color: "#FFF8E7", opacity: 0.8 }}>
                    {product.description || "No description"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}