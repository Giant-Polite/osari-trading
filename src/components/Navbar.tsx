import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const logo = "/logo.webp";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
    { to: "/login", label: "Login" },
  ];

  return (
    // Changed 'relative' to 'sticky top-0' and reduced padding from py-4/6 to py-2/3
    <nav className="sticky top-0 z-[100] bg-zinc-950 border-b border-white/5 py-1 md:py-1">
      <div className="container mx-auto px-4 md:px-6">
        {/* Floating Capsule Container */}
        <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-8 bg-zinc-900/40 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
          
          {/* LOGO & NAME */}
          <Link to="/" className="flex items-center gap-3 md:space-x-4 group">
            <div className="relative flex-shrink-0">
              <img 
                src={logo} 
                alt="Osari Trading" 
                className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover border border-[#D4AF37]/20 group-hover:border-[#D4AF37] transition-all duration-500" 
              />
            </div>
            {/* Mobile text is set to text-xl as requested */}
            <span 
              className="text-xl md:text-2xl tracking-[0.15em] md:tracking-[0.2em] font-light text-white uppercase whitespace-nowrap" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Osari <span className="italic text-[#D4AF37]">Trading</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => `
                  relative text-sm uppercase tracking-[0.3em] font-medium transition-all duration-500
                  ${isActive ? "text-[#D4AF37]" : "text-zinc-400 hover:text-white"}
                `}
              >
                {({ isActive }) => (
                  <span className="relative">
                    {link.label}
                    {isActive && (
                      <motion.div 
                        layoutId="navUnderline"
                        className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" 
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-[#D4AF37] p-2"
            >
              {isOpen ? <X strokeWidth={1.5} size={28} /> : <Menu strokeWidth={1.5} size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-zinc-950 border-b border-white/5"
          >
            <div className="flex flex-col items-center space-y-8 py-12">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    text-xl font-light tracking-[0.3em] uppercase transition-colors
                    ${isActive ? "text-[#D4AF37] italic" : "text-white/60"}
                  `}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;