import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  ShoppingBag, 
  ArrowLeft, 
  ChevronRight, 
  Filter, 
  Menu 
} from "lucide-react";

// UI Components - Assuming shadcn/ui pattern
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Supabase Client
import { supabase } from "../supabaseClient";

/**
 * TYPES
 */
interface Product {
  id: string | number;
  name: string;
  category: string;
  description: string;
  image: string;
  in_stock: boolean;
  price?: string;
}

interface Category {
  name: string;
  image_url: string;
}

/**
 * UTILITY: Truncate Text
 */
const truncateText = (text: string, wordLimit: number): string => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};

export default function ProductsPage() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"categories" | "products">("categories");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products and categories. 
        // Note: Removed 'tagline' from select to match your schema.
        const [productsRes, categoriesRes] = await Promise.all([
          supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("categories")
            .select("name, image_url")
        ]);

        if (productsRes.error) console.error("Products Error:", productsRes.error);
        if (categoriesRes.error) console.error("Categories Error:", categoriesRes.error);

        if (productsRes.data) setProducts(productsRes.data);
        if (categoriesRes.data) setDbCategories(categoriesRes.data);

      } catch (err) {
        console.error("Critical Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- LOGIC: FILTERING & CATEGORIES ---
  const categories = useMemo(() => {
    // This shows ALL categories found in your categories table,
    // ensuring the grid isn't empty even if products aren't assigned yet.
    return dbCategories.map((cat) => ({
      name: cat.name,
      tagline: "Premium Selection", // Hardcoded since it's not in your DB schema
      image: cat.image_url || "/Hero_Background.jpeg", 
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [dbCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory ? product.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  const handleRequestQuote = (productName: string) => {
    localStorage.setItem("contactProduct", productName);
    navigate("/contact");
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#1A0F0A]">
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="font-serif text-[#D4AF37] text-2xl tracking-widest uppercase"
        >
          Osari Trading LLC
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFDF9] selection:bg-[#D4AF37]/20">
      
      {/* --- FIGMA HERO SECTION - HALF PAGE --- */}
      <section className="relative h-[50vh] flex flex-col items-center justify-center px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src="/Hero_Background.jpeg"
            alt="Osari Trading Luxury Background"
            className="w-full h-full object-cover"
            style={{ filter: "blur(8px) brightness(0.4)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0A]/80 via-[#2A1F1A]/60 to-[#1A0F0A]/90" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-30 w-full max-w-2xl mb-8"
        >
          <div className="relative group">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "#D4AF37" }}
            />
            <Input
              type="text"
              placeholder="Search our collection..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value && view === "categories") setView("products");
              }}
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
              className="pl-14 pr-6 py-7 text-base border-none shadow-2xl backdrop-blur-xl transition-all"
              style={{
                background: isSearchActive
                  ? "rgba(255, 253, 249, 0.15)"
                  : "rgba(255, 253, 249, 0.08)",
                color: "#FFFDF9",
                borderRadius: "999px",
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-20 text-center"
        >
          <h1
            className="mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
              fontWeight: 300,
              letterSpacing: "0.05em",
              background: "linear-gradient(135deg, #D4AF37 0%, #F5E6CA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            {activeCategory || "Osari Trading"}
          </h1>
          <p
            className="max-w-xl mx-auto uppercase tracking-[0.2em]"
            style={{
              color: "#F5E6CA",
              fontSize: "0.85rem",
              fontWeight: 300,
            }}
          >
            Experience A Curated Collection Of High-Quality Halal Products,
             Delivered With Freshness And Excellence For Restaurants, Grocery Stores, And Local Businesses.


          </p>
        </motion.div>

        <AnimatePresence>
          {isSearchActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 backdrop-blur-sm bg-black/40 z-10"
            />
          )}
        </AnimatePresence>
      </section>

      {/* --- CONTENT AREA --- */}
      <section className="relative z-10 pt-24 pb-32 px-4 md:px-8 lg:px-16 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto">
          
          <AnimatePresence mode="wait">
            {view === "categories" ? (
              <motion.div
                key="categories"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-20"
                >
                  <span className="text-[#D4AF37] uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 block">
                    OSARI TRADING
                  </span>
                  <h2 
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      fontSize: "clamp(2.5rem, 5vw, 4rem)", 
                      color: "#1A0F0A",
                      fontWeight: 300,
                      lineHeight: 1
                    }}
                  >
                    Our Inventory
                  </h2>
                  <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mt-8 opacity-50" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  {categories.map((cat, idx) => (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => {
                        setActiveCategory(cat.name);
                        setView("products");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="group relative h-[500px] md:h-[650px] overflow-hidden cursor-pointer"
                    >
                      <img 
                        src={cat.image} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        alt={cat.name} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A] via-[#1A0F0A]/20 to-transparent" />
                      
                      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                        <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs mb-3">
                          {cat.tagline}
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 group-hover:tracking-wider transition-all duration-500">
                          {cat.name}
                        </h2>
                        <div className="flex items-center gap-4 text-white/60 text-xs tracking-[0.2em] uppercase group-hover:text-[#D4AF37] transition-colors">
                          Browse Collection 
                          <span className="w-12 h-[1px] bg-white/30 group-hover:w-20 group-hover:bg-[#D4AF37] transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button 
                  onClick={() => { setView("categories"); setActiveCategory(null); }}
                  className="mb-16 flex items-center gap-3 text-[#1A0F0A] uppercase tracking-[0.2em] text-xs hover:text-[#D4AF37] transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Categories
                </button>

                <div className="space-y-16 md:space-y-32">
                  {filteredProducts.map((product, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 items-center ${
                          isEven ? "" : "md:flex-row-reverse"
                        }`}
                      >
                        <div
                          className={`${isEven ? "md:col-span-7" : "md:col-span-7 md:col-start-6"} cursor-pointer group`}
                          onClick={() => setSelectedProduct(product)}
                        >
                          <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                              style={{ boxShadow: "0 20px 60px rgba(26, 15, 10, 0.15)" }}
                            />
                          </div>
                        </div>

                        <div className={`${isEven ? "md:col-span-5" : "md:col-span-5 md:col-start-1 md:row-start-1"} space-y-4 md:space-y-6`}>
                          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, color: "#1A0F0A", letterSpacing: "0.02em", lineHeight: 1.1 }}>
                            {product.name}
                          </h3>
                          <p className="hidden md:block" style={{ color: "#8B7355", fontSize: "1.125rem", fontWeight: 300, lineHeight: 1.8 }}>
                            {truncateText(product.description || "", 20)}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <Badge className="px-3 py-1 text-[10px]" style={{ background: "transparent", border: "1px solid #D4AF37", color: "#D4AF37", borderRadius: "2px", fontWeight: 400, letterSpacing: "0.05em" }}>
                              HALAL CERTIFIED
                            </Badge>
                            <Badge className="px-3 py-1 text-[10px]" style={{ background: product.in_stock ? "rgba(212, 175, 55, 0.1)" : "rgba(139, 115, 85, 0.1)", border: "none", color: product.in_stock ? "#D4AF37" : "#8B7355", borderRadius: "2px", fontWeight: 400, letterSpacing: "0.05em" }}>
                              {product.in_stock ? "AVAILABLE" : "OUT OF STOCK"}
                            </Badge>
                          </div>
                          <Button onClick={() => handleRequestQuote(product.name)} className="group transition-all duration-300 hover:scale-105 w-full md:w-auto" style={{ background: "transparent", border: "1px solid #D4AF37", color: "#D4AF37", padding: "1.5rem 3rem", borderRadius: "2px", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                            Request Bulk Quote
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* --- PRODUCT MODAL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{ background: "rgba(26, 15, 10, 0.9)", backdropFilter: "blur(15px)" }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden"
              style={{ background: "rgba(255, 253, 249, 0.98)", borderRadius: "2px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-50" style={{ background: "#1A0F0A", color: "#D4AF37", borderRadius: "0", width: "44px", height: "44px", padding: 0 }}>
                <X className="w-5 h-5" />
              </Button>
              <div className="hidden md:grid md:grid-cols-2 h-full overflow-y-auto">
                <div className="relative flex items-center justify-center p-16" style={{ background: "#F1ECE7" }}>
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-auto object-contain max-h-[600px]" />
                </div>
                <div className="p-8 md:p-16 flex flex-col h-[90vh] bg-white">
                  <div className="mb-6">
                    <span className="text-[#D4AF37] tracking-[0.3em] text-[10px] uppercase block">{selectedProduct.category}</span>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", fontWeight: 400, color: "#1A0F0A" }}>{selectedProduct.name}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-4 mb-8">
                    <p style={{ color: "#8B7355", fontSize: "1.125rem", fontWeight: 300, lineHeight: 1.8 }}>{selectedProduct.description}</p>
                  </div>
                  <div className="pt-6 border-t border-stone-100">
                    <Button onClick={() => handleRequestQuote(selectedProduct.name)} className="w-full py-8" style={{ background: "#1A0F0A", color: "#D4AF37", borderRadius: "0", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                      Request Wholesale Quote
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}