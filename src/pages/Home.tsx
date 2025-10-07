import { useCategories, useProducts } from "@/hooks/useProducts";
import CategoryCard from "@/components/CategoryCard";
import TypewriterText from "@/components/TypewriterText";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Truck, Shield } from "lucide-react";
import { useMemo } from "react";

// Shuffle products and avoid adjacent duplicates
const shuffleAndAvoidAdjacent = (array: any[]) => {
  if (!array) return [];
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  for (let i = 1; i < shuffled.length; i++) {
    if (shuffled[i].id === shuffled[i - 1].id) {
      const swapWith = (i + 1) % shuffled.length;
      [shuffled[i], shuffled[swapWith]] = [shuffled[swapWith], shuffled[i]];
    }
  }
  return shuffled;
};

const Home = () => {
  const { data: categories } = useCategories();
  const { data: products } = useProducts();

  // Shuffle products once
  const shuffledProducts = useMemo(() => shuffleAndAvoidAdjacent(products || []), [products]);

  // Duplicate for seamless scroll
  const displayProducts = useMemo(() => [...shuffledProducts, ...shuffledProducts], [shuffledProducts]);

  return (
    <main className="bg-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-white py-12 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-7xl md:text-7xl font-extrabold text-Brown-800 mb-4 tracking-tight animate-fade-in">
            OSARI TRADING
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            Premium consumer packaged goods including:
          </p>
          <div className="mb-8 h-8 flex items-center justify-center animate-fade-in">
            <TypewriterText />
          </div>
          <Button
            asChild
            size="lg"
            className="bg-yellow-400 text-deepbrown hover:bg-yellow-400/90 shadow-lg transition-all animate-fade-in"
          >
            <Link to="/products">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* ================= SCROLLING PRODUCT CAROUSEL ================= */}
        <div className="relative mt-16 overflow-hidden">
          {/* Gradient edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="overflow-hidden">
            <div className="flex w-max animate-scroll-left">
              {displayProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="flex-shrink-0 w-32 md:w-40 lg:w-48 mx-3 rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 md:h-40 lg:h-48 object-contain transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTRO SECTION ================= */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
            Explore our wide range of halal products, carefully curated for quality and freshness, suitable for restaurants, grocery stores, and local businesses.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-yellow-400 text-deepbrown hover:bg-yellow-400/90 hover:shadow-lg transition-all"
          >
            <Link to="/products">
              Shop All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-200 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">100% Halal Certified</h3>
            <p className="text-gray-600">
              All products are certified halal and meet the highest quality standards.
            </p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-200 rounded-full mb-4">
              <Truck className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reliable Delivery</h3>
            <p className="text-gray-600">
              Timely shipping across all regions.
            </p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-200 rounded-full mb-4">
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">
              Satisfaction guaranteed or your money back.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 bg-yellow-400 text-deepbrown text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers who trust Osari Trading for premium halal foods.
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent border-deepbrown hover:bg-deepbrown/10"
          >
            <Link to="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Home;
