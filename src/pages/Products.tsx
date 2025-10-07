import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks/useProducts";
import TypewriterText from "@/components/TypewriterText";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(categoryFilter);
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // State for mobile navbar toggle

  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const navbarRef = useRef<HTMLDivElement | null>(null); // Reference for the navbar to scroll it

  // Filter products by search term
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  // Group products by category
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
    const offset = 144; // Accounts for global navbar (~64px) + category navbar (~80px)
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveCategory(slug);
  };

  // Update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 154; // Adjusted for global + category navbar
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
      if (!foundActive && window.scrollY < 154) {
        setActiveCategory(categoryFilter || "");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [productsByCategory, categoryFilter]);

  // Auto-scroll the navbar when category changes
  useEffect(() => {
    if (navbarRef.current && activeCategory) {
      const activeBtn = navbarRef.current.querySelector(
        `[data-category=${activeCategory}]`
      );
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }
  }, [activeCategory]);

  return (
    <main className="bg-white min-h-screen font-museo-slab">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[hsl(var(--primary))] mb-2">
            Our Products
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Browse premium halal products across all categories.
          </p>
        </header>

        {/* Sticky Horizontal Nav with Opaque Styling */}
        <div
          ref={navbarRef}
          className="sticky top-[64px] z-40 bg-[hsl(var(--primary))] py-3 px-4 shadow-2xl flex justify-center overflow-x-auto rounded-2xl mb-6 border border-[hsl(var(--primary))/0.3] animate-slide-up"
        >
          <div className="flex gap-2 overflow-x-auto space-x-2">
            {loadingCategories
              ? [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
                  />
                ))
              : categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.slug)}
                    data-category={cat.slug} // Added to use in auto-scrolling
                    className={`relative px-4 py-2 font-museo-slab text-sm md:text-base font-semibold text-white rounded-full transition-all duration-300 transform hover:scale-110 hover:bg-[hsl(var(--primary))/0.9] hover:shadow-lg ${
                      activeCategory === cat.slug
                        ? "font-extrabold bg-brown text-[hsl(var(--primary))] scale-110 shadow-md"
                        : "text-white/90"
                    }`}
                  >
                    {cat.name.toUpperCase()}
                    {/* Animated underline */}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-2 bg-white rounded-full transition-all duration-500 ease-in-out ${
                        activeCategory === cat.slug ? "w-4/5" : "w-0"
                      }`}
                    ></span>
                  </button>
                ))}
          </div>
        </div>

        {/* Mobile Navbar Toggle */}
        <div className="block md:hidden">
          <button
            className="bg-[hsl(var(--primary))] text-white py-2 px-4 rounded-lg"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            Categories
          </button>
          {mobileNavOpen && (
            <div className="mt-4">
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.slug)}
                  data-category={cat.slug}
                  className={`block w-full text-left px-4 py-2 font-museo-slab text-sm md:text-base font-semibold text-white rounded-full transition-all duration-300 transform hover:scale-110 hover:bg-[hsl(var(--primary))/0.9] hover:shadow-lg ${
                    activeCategory === cat.slug
                      ? "font-extrabold bg-brown text-[hsl(var(--primary))] scale-110 shadow-md"
                      : "text-white/90"
                  }`}
                >
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="mb-6 max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-2 border-gray-200 focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] rounded-xl"
          />
        </div>

        {/* Product Grid */}
        <div className="space-y-20 mt-8">
          {categories?.map((cat) => {
            const catProducts = productsByCategory[cat.slug];
            if (!catProducts || catProducts.length === 0) return null;
            return (
              <section
                key={cat.id}
                ref={(el) => (categoryRefs.current[cat.slug] = el)}
                className="scroll-mt-36"
              >
                <h2 className="text-3xl md:text-4xl font-museo-slab text-[hsl(var(--primary))] mb-6 uppercase border-b-4 border-[hsl(var(--primary))] inline-block pb-1">
                  {cat.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {catProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 p-4"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-contain mb-4 rounded-xl"
                      />
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{product.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Typewriter Section at bottom */}
      <section className="bg-[#fff9e0] py-16 mt-20">
        <div className="container mx-auto px-4 flex justify-center items-center gap-3 flex-wrap">
          <span className="text-3xl md:text-4xl font-bold text-[#8B4513]">
            Would you like some
          </span>
          <div className="text-3xl md:text-4xl font-bold text-[#8B4513]">
            <TypewriterText speed={99} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductsPage;
