import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Truck, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import TypewriterText from "@/components/TypewriterText";

// ========================================
// UTILS
// ========================================
const shuffleAndAvoidAdjacent = (array: any[]) => {
  if (!array?.length) return [];
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  for (let i = 1; i < shuffled.length; i++) {
    if (shuffled[i].id === shuffled[i - 1].id) {
      const swapWith = (i + 1) % shuffled.length;
      [shuffled[i], shuffled[swapWith]] = [shuffled[swapWith], shuffled[i]];
    }
  }
  return shuffled;
};

// ========================================
// HOME PAGE
// ========================================
export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data || []);
      }
    };

    fetchProducts();
  }, []);

  const shuffledProducts = useMemo(
    () => shuffleAndAvoidAdjacent(products),
    [products]
  );

  const displayProducts = useMemo(
    () => [...shuffledProducts, ...shuffledProducts],
    [shuffledProducts]
  );

  return (
    <main className="bg-zinc-950 text-white antialiased overflow-hidden">
      {/* ========================================
          HERO
          ======================================== */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24">
        {/* Animated gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(180deg,#18181b,#09090b,#000)",
              "linear-gradient(180deg,#27272a,#09090b,#000)",
              "linear-gradient(180deg,#18181b,#09090b,#000)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ambient lights */}
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Parallax dots */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          }}
        >
          <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-amber-500/30 rounded-full blur-sm" />
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-yellow-500/40 rounded-full blur-sm" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <motion.h1
            className="text-[clamp(3rem,8vw,8rem)] font-light tracking-tighter mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            OSARI TRADING
          </motion.h1>

          {/* Headline */}
          <div className="mb-24">
            <p className="text-xl md:text-2xl text-zinc-400 mb-6 font-light">
              Family-Owned Wholesale Distributor Based In Minneapolis, Minnesota, Proudly Serving Restaurants, Grocery Stores, and Food Service Businesses Across The Midwest.
            </p>
            <div className="min-h-[80px] flex items-center gap-4 text-3xl md:text-5xl font-light">
              <span>Bringing You the Very Best In</span>
              <TypewriterText speed={80} />
            </div>
          </div>

          {/* CTA */}
          <Link to="/products">
            <motion.button
              className="relative px-10 py-5 bg-white text-black font-medium tracking-wide overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore Our Collection <ArrowRight />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* ========================================
          PRODUCT SLIDER
          ======================================== */}
      <section className="relative py-32 overflow-hidden">
        <div className="px-6 md:px-12 lg:px-24 mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-4">
            Our Selection
          </h2>
          <p className="text-zinc-400 text-xl font-light">
            Curated With Precision. Delivered With Care.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

          <div className="overflow-hidden">
            {products.length === 0 ? (
              <div className="h-96 flex items-center justify-center text-zinc-500">
                Loading collection…
              </div>
            ) : (
              <div className="flex w-max animate-scroll-left-fast">
                {displayProducts.map((product, index) => (
                  <motion.div
                    key={`${product.id}-${index}`}
                    className="flex-shrink-0 w-80 md:w-96 mx-4 group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900 border border-zinc-800">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/600x450";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 p-6">
                        <h3 className="text-xl font-light bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================
          VALUE PROPS
          ======================================== */}
      <section className="py-32 px-6 md:px-12 lg:px-24">
        <h2 className="text-4xl md:text-5xl font-light mb-24">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-16">
          {[
            {
              icon: CheckCircle,
              title: "Certified Excellence",
              desc: "Every product meets rigorous halal standards.",
            },
            {
              icon: Truck,
              title: "Swift Delivery",
              desc: "Reliable logistics you can trust.",
            },
            {
              icon: Shield,
              title: "Guaranteed Quality",
              desc: "Uncompromising standards at every step.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="mb-6 w-20 h-20 flex items-center justify-center border border-amber-500/30">
                <f.icon className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-2xl font-light mb-3">{f.title}</h3>
              <p className="text-zinc-400 font-light">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================
          FINAL CTA
          ======================================== */}
      <section className="py-32 text-center relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-light mb-8">
            Ready to Elevate Your Offerings?
          </h2>
          <p className="text-zinc-400 text-xl mb-12 font-light">
            Join industry leaders who trust Osari for premium sourcing.
          </p>

          <Link to="/contact">
            <motion.button
              className="px-14 py-6 border-2 border-white text-white text-lg font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Get in Touch <ArrowRight className="inline ml-3" />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* ========================================
          STYLES
          ======================================== */}
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left-fast {
          animation: scroll-left 200s linear infinite;
        }
        .animate-scroll-left-fast:hover {
          animation-play-state: paused;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </main>
  );
}
