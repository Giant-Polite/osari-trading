import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePremiumToast } from "@/hooks/usePremiumToast";
import { ToastContainer } from "@/components/PremiumToast";
import TypewriterText from "@/components/TypewriterText";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, ShoppingBag, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "../supabaseClient";

const addToCart = (productName: string) => {
  const cart = JSON.parse(localStorage.getItem("cartProducts") || "[]") as string[];
  if (!cart.includes(productName)) {
    cart.push(productName);
    localStorage.setItem("cartProducts", JSON.stringify(cart));
    return true;
  }
  return false;
};

interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  image: string;
  in_stock: boolean;
}

interface Category {
  name: string;
  slug: string;
}

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const { toasts, showToast, removeToast } = usePremiumToast();
  const navigate = useNavigate();
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const navBarRef = useRef<HTMLDivElement>(null); // Ref for the Navbar container
  const categoryButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({}); // Refs for category buttons

  // Fetch products and categories from Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error.message);
    } else {
      console.log("Fetched products:", data);
      setProducts(data || []);

      // Extract unique categories and sort A-Z
      const uniqueCategories = Array.from(
        new Set(data?.map((p) => p.category))
      )
        .sort((a, b) => a.localeCompare(b))
        .map((name) => ({
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }));
      console.log("Unique categories:", uniqueCategories);
      setCategories(uniqueCategories);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description?.toLowerCase().includes(term) ?? false)
    );
  }, [products, searchTerm]);

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    filteredProducts.forEach((p) => {
      const catSlug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (!grouped[catSlug]) grouped[catSlug] = [];
      grouped[catSlug].push(p);
    });
    return grouped;
  }, [filteredProducts]);

  const scrollToCategory = (slug: string) => {
    const el = categoryRefs.current[slug];
    if (!el) return;
    const offset = 90;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveCategory(slug);
  };

  // Auto-scroll Navbar to center the active category
  useEffect(() => {
    if (activeCategory && navBarRef.current && categoryButtonRefs.current[activeCategory]) {
      const navBar = navBarRef.current;
      const activeButton = categoryButtonRefs.current[activeCategory];
      if (!activeButton) return;

      const buttonRect = activeButton.getBoundingClientRect();
      const navBarRect = navBar.getBoundingClientRect();

      // Calculate the scroll position to center the active button
      const scrollLeft =
        activeButton.offsetLeft +
        buttonRect.width / 2 -
        navBarRect.width / 2;

      // Smoothly scroll the Navbar
      navBar.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 400);

      const scrollPos = scrollY + 140;
      let found = false;

      for (const [slug, el] of Object.entries(categoryRefs.current)) {
        if (!el) continue;
        const { offsetTop, offsetHeight } = el;
        if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
          setActiveCategory(slug);
          found = true;
          break;
        }
      }
      if (!found) setActiveCategory("");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [productsByCategory]);

  const handleRequestQuote = (productName: string) => {
    localStorage.setItem("contactProduct", productName);
    if (addToCart(productName)) {
      showToast({
        title: "Request Sent",
        description: `${productName} has been added to the contact form.`,
        variant: "success",
        duration: 3000,
      });
    } else {
      showToast({
        title: "Already in Cart",
        description: `${productName} is already in the contact form.`,
        variant: "info",
        duration: 3000,
      });
    }
    navigate("/contact");
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <main className="min-h-screen bg-[var(--background)] relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--chart-1)]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--chart-4)]/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 glass px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-4 md:mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-[var(--chart-1)]" />
              <span className="text-sm font-medium gradient-text-gold">
                Premium Halal Quality Products
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold gradient-text-gold mb-4 leading-tight">
              Our Products
            </h1>
            <p className="text-base md:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Explore our authentic, premium-quality halal products —{" "}
              <span className="text-[var(--chart-1)]">crafted with care</span> for
              exceptional taste.
            </p>
          </motion.header>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 max-w-2xl mx-auto"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-5 border-2 border-[var(--border)] focus:border-[var(--chart-1)] focus:ring-4 focus:ring-[var(--chart-1)]/20 rounded-2xl shadow-lg"
              />
            </div>
          </motion.div>

          {/* Sticky Floating Category Navbar */}
          <motion.div
            className="sticky top-[64px] z-[60] mb-10 bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-lg rounded-xl p-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              ref={navBarRef}
              className="flex gap-2 overflow-x-auto px-2 scrollbar-hide"
            >
              {categories?.map((cat, index) => (
                <motion.button
                  key={cat.slug}
                  ref={(el) => (categoryButtonRefs.current[cat.slug] = el)}
                  onClick={() => scrollToCategory(cat.slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat.slug
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-105"
                      : "bg-white hover:bg-orange-50 text-gray-700"
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Grid */}
          <div className="space-y-16 md:space-y-24 mt-12">
            {categories?.map((cat) => {
              const catProducts = productsByCategory[cat.slug];
              if (!catProducts?.length) return null;

              return (
                <motion.section
                  key={cat.slug}
                  ref={(el) => (categoryRefs.current[cat.slug] = el)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="scroll-mt-[120px]"
                >
                  <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-3xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent font-bold">
                      {cat.name}
                    </h2>
                    <Badge className="bg-orange-100 text-orange-700 px-4 py-1">
                      {catProducts.length} items
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
                    {catProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100 group"
                      >
                        <div className="relative overflow-hidden aspect-square bg-gray-50 flex items-center justify-center">
                          <img
                            src={product.image || "https://via.placeholder.com/300x192"}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              console.error(`Image failed to load: ${product.image}`);
                              e.currentTarget.src = "https://via.placeholder.com/300x192";
                            }}
                          />
                        </div>

                        <div className="p-5">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {product.description || "No description"}
                          </p>
                          <div className="flex gap-2 mb-4">
                            <Badge className="bg-green-500 text-white text-xs">
                              Halal Certified
                            </Badge>
                            <Badge className="bg-blue-50 text-blue-700 text-xs border border-blue-200">
                              Premium Quality
                            </Badge>
                            <Badge className={product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} text-xs>
                              {product.in_stock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => handleRequestQuote(product.name)}
                            className="w-full bg-gradient-to-r from-[#8B4513] to-[#FFD700] text-white font-medium hover:opacity-90 hover:scale-[1.02] transition-all rounded-lg py-2 shadow-md"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Request Bulk Quote
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            })}
            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-600">No products match your filters.</p>
            )}
          </div>
        </div>

        {/* Typewriter CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mt-20 md:mt-32 py-12 md:py-20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex justify-center items-center gap-3 text-center text-white text-3xl md:text-5xl font-bold">
              <span>Would you like some</span>
              <TypewriterText speed={99} />
            </div>
          </div>
        </motion.section>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg"
            style={{ background: "#FFD700", color: "#8B6F47" }}
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
        )}
      </main>
    </>
  );
};

export default ProductsPage;