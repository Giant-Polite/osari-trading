import { useState, useMemo, useEffect, useRef } from "react";
import { useProducts, useCategories, type Product } from "@/hooks/useProducts";
import TypewriterText from "@/components/TypewriterText";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const navbarRef = useRef<HTMLDivElement | null>(null);

  // 🔎 Filter products by search term
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  // 🗂️ Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, typeof products> = {};
    filteredProducts.forEach((p) => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    return grouped;
  }, [filteredProducts]);

  const scrollToCategory = (slug: string) => {
    const el = categoryRefs.current[slug];
    if (!el) return;
    const offset = 160;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveCategory(slug);
  };

  // 🧭 Track active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 170;
      let foundActive = false;
      for (const [slug, el] of Object.entries(categoryRefs.current)) {
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveCategory(slug);
            foundActive = true;
            break;
          }
        }
      }
      if (!foundActive && window.scrollY < 170) {
        setActiveCategory("");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [productsByCategory]);

  // 🧭 Auto-scroll active category into view
  useEffect(() => {
    if (navbarRef.current && activeCategory) {
      const activeBtn = navbarRef.current.querySelector(
        `[data-category="${activeCategory}"]`
      );
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* ✨ Background Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        {/* 🏷️ Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-3 md:mb-4">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
            <span className="text-xs md:text-sm text-orange-800">
              Premium Quality Products
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent mb-3 md:mb-4 px-4">
            Our Products
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Discover our premium selection of halal products, carefully curated
            for quality and taste
          </p>
        </motion.header>

        {/* 🔍 Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 md:mb-8 max-w-2xl mx-auto px-2"
        >
          <div className="relative group">
            <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors w-4 h-4 md:w-5 md:h-5" />
            <Input
              type="text"
              placeholder="Search for your favorite products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 md:pl-14 pr-6 py-5 md:py-6 border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm transition-all"
            />
          </div>
        </motion.div>

        {/* 🧭 Category Nav (Sticky below main Navbar) */}
        <motion.div
          ref={navbarRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="sticky top-[72px] z-40 mb-8 md:mb-12"
        >
          <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-xl md:rounded-2xl p-2 md:p-3 mx-auto max-w-full overflow-x-auto">
            <div className="flex gap-1.5 md:gap-2 min-w-max px-2 md:px-0">
              {loadingCategories
                ? [...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="h-9 md:h-11 w-24 md:w-28 bg-gray-200 rounded-lg md:rounded-xl animate-pulse flex-shrink-0"
                    />
                  ))
                : categories?.map((cat, index) => (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => scrollToCategory(cat.slug)}
                      data-category={cat.slug}
                      className={`relative px-3 py-2 md:px-6 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm transition-all duration-300 whitespace-nowrap group flex-shrink-0 ${
                        activeCategory === cat.slug
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-300/50 scale-105"
                          : "bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 hover:shadow-md"
                      }`}
                    >
                      <span className="relative z-10">{cat.name}</span>
                      {activeCategory === cat.slug && (
                        <motion.div
                          layoutId="activeCategory"
                          className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg md:rounded-xl"
                          transition={{ type: "spring", duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                  ))}
            </div>
          </div>
        </motion.div>

        {/* 🧱 Product Grid */}
        <div className="space-y-16 md:space-y-24 mt-12 md:mt-16">
          {categories?.map((cat, catIndex) => {
            const catProducts = productsByCategory[cat.slug];
            if (!catProducts || catProducts.length === 0) return null;
            return (
              <motion.section
                key={cat.id}
                ref={(el) => (categoryRefs.current[cat.slug] = el)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: catIndex * 0.1 }}
                className="scroll-mt-40"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-6 md:mb-8 px-2">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-4xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent inline-block">
                      {cat.name}
                    </h2>
                    <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-2"></div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-700 px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm"
                  >
                    {catProducts.length} items
                  </Badge>
                </div>

                {/* Product Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-2">
                  {catProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="group bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 aspect-square">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Hover Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                            <span className="text-orange-600 text-sm md:text-base">
                              View Details
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 md:p-5">
                        <h3 className="text-gray-900 mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>

      {/* 🪄 Typewriter Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mt-20 md:mt-32 py-12 md:py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap text-center">
            <span className="text-2xl md:text-5xl text-white">
              Would you like some
            </span>
            <div className="text-2xl md:text-5xl text-white">
              <TypewriterText speed={99} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* 🪟 Product Details Dialog */}
      <AnimatePresence>
        {selectedProduct && (
          <Dialog
            open={!!selectedProduct}
            onOpenChange={() => setSelectedProduct(null)}
          >
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
              <div className="relative">
                {/* Image */}
                <div className="relative h-64 md:h-80 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <div className="p-6 md:p-8">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl md:text-3xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                      {selectedProduct.name}
                    </DialogTitle>
                  </DialogHeader>

                  <p className="text-gray-700 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-6">
                    <Badge className="bg-green-500 text-white hover:bg-green-600">
                      ✓ Halal Certified
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      Premium Quality
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProductsPage;
