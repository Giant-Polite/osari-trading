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

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12">
  <div className="flex flex-col items-start">
    
    {/* --- BRAND ARCHITECTURE (Logo) --- */}
    <div className="relative mb-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, letterSpacing: "0.2em" }}
        animate={{ opacity: 1, letterSpacing: "0.6em" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-[#D4AF37] text-[10px] md:text-xs font-medium mb-4 uppercase"
      >
        The Gold Standard of Distribution
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="relative leading-[0.85] flex flex-col md:flex-row md:items-end gap-x-8"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(4rem, 12vw, 9.5rem)",
          fontWeight: 300,
        }}
      >
        <span className="text-[#FFFDF9] italic tracking-tight">OSARI</span>
        <span 
          className="text-transparent bg-clip-text bg-gradient-to-tr from-[#D4AF37] via-[#F5E6CA] to-[#8B7355] tracking-tighter"
          style={{ fontWeight: 200 }}
        >
          TRADING
        </span>
      </motion.h1>
      
      {/* Decorative hairline */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="h-[1px] w-full bg-gradient-to-r from-[#D4AF37]/40 to-transparent origin-left mt-4"
      />
    </div>

    {/* --- MISSION STATEMENT & TAGLINE --- */}
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
      
      {/* Narrative Text */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="md:col-span-5 border-l border-[#D4AF37]/20 pl-6 md:pl-10"
      >
        <p className="text-sm md:text-base text-[#F5E6CA]/80 font-light leading-relaxed uppercase tracking-widest italic mb-6">
          Established in Minnesota
        </p>
        <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed">
          A Family Owned Legacy, Delivering Excellence To The Midwest’s Finest 
          <span className="text-white font-normal"> Restaurants</span>, 
          <span className="text-white font-normal"> Grocery Stores</span> and
          <span className="text-white font-normal"> Food Service Businesses</span> Across The Midwest.
        </p>
      </motion.div>

      {/* Dynamic Reveal Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="md:col-span-7 flex flex-col justify-end"
      >
        <div className="h-[1px] w-12 bg-[#D4AF37] mb-8 hidden md:block" />
        <h2 className="text-3xl md:text-5xl font-light text-[#FFFDF9] leading-tight">
          <span className="opacity-50 italic">The Artistry Of </span>
          <br className="hidden md:block" />
          <span className="relative">
             Wholesale Excellence
            <motion.span 
              className="absolute -bottom-2 left-0 h-[2px] bg-[#D4AF37]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 2, duration: 1 }}
            />
          </span>
        </h2>
        
        {/* If you still want the Typewriter, place it here with a minimalist style */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-2">
  <div className="flex items-center gap-3 text-[#D4AF37] tracking-[0.2em] text-[10px] uppercase font-semibold">
    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
    <span>Bringing You the Very Best In:</span>
  </div>

  {/* This container prevents the layout shift */}
  <div className="relative h-8 md:h-20 flex items-center overflow-hidden">
    <span className="text-xl md:text-2xl font-light text-white/90 italic">
      <TypewriterText speed={100} />
    </span>
  </div>
</div>
      </motion.div>

    </div>
  </div>

          {/* CTA */}
          <Link to="/products" className="block mt-20 md:mt-12 group"> 
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-12 py-6 bg-white overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-shadow duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              {/* Subtle sweep animation that runs constantly */}
              <motion.div
                className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-amber-100/40 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              />

              {/* The colorful hover state: Multi-stop Metallic Gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#8B7355] via-[#D4AF37] via-[#F5E6CA] via-[#D4AF37] to-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              />

              <span className="relative z-10 flex items-center gap-4 text-xs md:text-sm font-bold tracking-[0.2em] text-black group-hover:text-white transition-colors duration-500">
                EXPLORE OUR COLLECTION 
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </span>
            </motion.button>
          </Link>
        </div>
      </section>

            {/* ========================================
          PRODUCT SELECTION INTRO: ULTRA LUXURY
          ======================================== */}

      <section className="relative pt-40 pb-20 overflow-hidden bg-[#050505]">
        {/* Header: Editorial Alignment */}
        <div className="relative z-10 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] text-xs uppercase tracking-[0.5em] block mb-6 font-medium"
            >
              The Osari Standard
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="text-5xl md:text-7xl font-light text-white leading-none mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our <span className="italic text-[#D4AF37]">Curated</span> Reserve
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-zinc-500 text-lg md:text-xl font-light tracking-wide max-w-md leading-relaxed"
            >
              The Definitive Collection Of Premium Halal Supplies, Authenticated And Sourced From Earth’s Most Celebrated Producers.
            </motion.p>
          </div>
          
          {/* Decorative Counter / Inventory Marker */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="hidden md:block text-right"
          >
            <span className="text-7xl font-extralight text-zinc-800 leading-none select-none">
              {String(products.length).padStart(2, '0')}
            </span>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mt-2 font-semibold">
              Curated Unique Items
            </p>
          </motion.div>
        </div>

        {/* Background Text Decor: This creates the "High Fashion" texture */}
        <div className="absolute -bottom-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none">
          <motion.span 
            initial={{ x: 0 }}
            animate={{ x: "-20%" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-[18rem] font-serif whitespace-nowrap italic text-white block"
          >
            Quality Excellence Sourcing Purity Quality Excellence Sourcing Purity
          </motion.span>
        </div>
        
        {/* Subtle Gold Hairline separator at bottom */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mt-20">
          <div className="h-[1px] w-full bg-gradient-to-r from-[#D4AF37]/30 via-transparent to-transparent" />
        </div>

        <div className="relative">
          {/* We reduced the width from w-64 to w-16 on mobile (md:w-64) */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-64 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-64 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

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
                    <div className="relative aspect-[2/2] overflow-hidden bg-zinc-900 border border-zinc-800">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/600x450";
                        }}
                      />
                      {/* 'hidden md:block' ensures the darkness only appears on larger screens */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent hidden md:block" />
                      <div className="absolute bottom-0 p-6">

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
        <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="text-4xl md:text-7xl font-light text-white leading-none mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Why <span className="italic text-[#D4AF37]">Choose</span> Us
            </motion.h2>

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
            Join Industry Leaders Who Trust Osari Trading for Premium Sourcing.
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
