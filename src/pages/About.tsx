import {
  Wheat,
  Wine,
  Award,
  Users,
  Sparkles,
  Handshake,
  Leaf,
  Truck,
  ChevronDown,
} from "lucide-react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef, useState} from "react";

const About = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [showIndicator, setShowIndicator] = useState(true);


  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // === Data ===
  const stats = [
    { label: "Generations of Experience", value: "3+", icon: Award },
    { label: "Products Supplied", value: "5000+", icon: Wheat },
    { label: "Trusted Clients", value: "100+", icon: Users },
    { label: "Minneapolis & Midwest", value: "MN", icon: Wine },
  ];

  const highlights = [
    { icon: "🌾", text: "Premium Grains & Raw Foods at Wholesale Scale" },
    { icon: "🌶️", text: "From Farm to Flavor, Wholesale Spices Done Right" },
    { icon: "🥤", text: "Beverages at Wholesale Scale" },
  ];

  const values = [
    {
      icon: Handshake,
      title: "Integrity",
      description:
        "We build lasting relationships through transparency, honesty, and trust — the foundation of every deal we make.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description:
        "From sourcing to distribution, we choose partners and practices that protect the environment and future generations.",
    },
    {
      icon: Truck,
      title: "Reliability",
      description:
        "Our clients depend on us for consistency, punctuality, and quality. We deliver — every single time.",
    },
  ];

  // === Variants ===
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-[#fff9f2] to-[#fefaf6] relative overflow-hidden scroll-smooth">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.1),transparent_60%),radial-gradient(circle_at_80%_70%,hsl(var(--secondary)/0.1),transparent_70%)] pointer-events-none"></div>

      {/* === HERO === */}
      <section ref={heroRef} className="relative overflow-hidden">
        <motion.img
          src="/warehouse.webp"
          alt="Osari Trading LLC Warehouse"
          className="w-full h-[600px] object-cover"
          style={{ y }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent flex flex-col items-center justify-center text-center text-white px-4">
          <motion.div
            className="inline-flex items-center bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-4 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            Creating the Future of Trusted Trade
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-gold to-olive bg-clip-text text-transparent"
          >
            Osari Trading LLC
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-2xl md:text-3xl mt-4 text-amber-100"
          >
            Family-Run Wholesale Excellence
          </motion.h2>
        
        {/* Scroll Indicator */}
          {showIndicator && (
            <motion.div
              className="absolute bottom-10 text-white flex flex-col items-center"
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [0, 10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-8 h-8 text-white/80" />
              <span className="text-sm mt-1 text-white/70">Scroll</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* === ABOUT === */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          className="max-w-4xl mx-auto bg-card rounded-xl p-8 md:p-14 shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
            About Us
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-base md:text-lg">
            <p>
              <strong className="text-primary">Osari Trading LLC</strong> is a
              family-owned wholesale business proudly serving Minneapolis and the
              Midwest. With three generations of experience, we specialize in
              sourcing and distributing premium food, beverages, and certified
              Halal products.
            </p>
            <p>
              From raw grains and spices to beverages and halal-certified items,
              we are committed to meeting the diverse needs of restaurants,
              grocery stores, and local businesses.
            </p>
            <p>
              At Osari Trading LLC, you’re not just a customer — you’re part of
              our extended family.
            </p>
          </div>
        </motion.div>
      </section>

      {/* === HIGHLIGHTS === */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.2 }}
              className="bg-card rounded-xl p-8 text-center shadow-md hover:shadow-[var(--shadow-gold)] transition-all duration-300"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <p className="font-medium text-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === STATS === */}
      <section className="container mx-auto px-6 pb-28">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-card rounded-xl p-8 md:p-10 text-center shadow-md hover:shadow-[var(--shadow-gold)] transition-all duration-300"
              >
                <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="text-3xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* === VALUES === */}
      <section className="pb-32 px-6">
        <motion.div
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h3 className="text-4xl mb-3 bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 bg-clip-text text-transparent">
              Our Values
            </h3>
            <p className="text-muted-foreground text-lg">
              What drives us every day
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ y: -12, scale: 1.05 }}
                  className="text-center group"
                >
                  <motion.div
                    className="inline-flex p-5 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="h-12 w-12 text-white" />
                  </motion.div>
                  <h4 className="text-foreground mb-3 text-xl">
                    {value.title}
                  </h4>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default About;