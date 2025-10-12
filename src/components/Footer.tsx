import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { DateTime } from "luxon";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isOpen, setIsOpen] = useState(false);
  const [statusText, setStatusText] = useState("");
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 🕒 Business Hours Logic — Minnesota time
  useEffect(() => {
    const updateStatus = () => {
      const now = DateTime.now().setZone("America/Chicago");
      const day = now.weekday; // Monday=1 … Sunday=7
      const hour = now.hour;
      const minute = now.minute;

      let open = false;
      let nextOpen = "";

      if (day >= 1 && day <= 5) {
        open = hour >= 9 && hour < 17;
        nextOpen = "9:00 AM – 5:00 PM";
      } else if (day === 6) {
        open = hour >= 9 && hour < 16;
        nextOpen = "9:00 AM – 4:00 PM";
      } else {
        open = false;
        nextOpen = "Opens Monday at 9:00 AM";
      }

      if (!open && day < 6 && (hour < 9 || hour >= 17))
        nextOpen = "Opens tomorrow at 9:00 AM";

      setIsOpen(open);
      setStatusText(open ? "Open Now" : nextOpen);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🎢 3D Tilt Effect for Cards
  useEffect(() => {
    tiltRefs.current.forEach((card) => {
      if (!card) return;
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / rect.height) * 10;
        const rotateY = ((x - rect.width / 2) / rect.width) * -10;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      };

      const resetTilt = () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", resetTilt);

      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", resetTilt);
      };
    });
  }, []);

  return (
    <footer className="relative bg-accent text-accent-foreground overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(45, 62%, 52%, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(45, 62%, 52%, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4" ref={(el) => (tiltRefs.current[0] = el)}>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-accent shadow-lg font-bold text-lg">
                O
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-accent-foreground via-primary to-accent-foreground bg-clip-text text-transparent animate-gradient">
                Osari Trading
              </span>
            </div>
            <p className="text-accent-foreground/70 leading-relaxed">
              Proudly family-operated, serving Minneapolis and the Midwest with dedication and excellence.
            </p>
            <div className="pt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${
                  isOpen
                    ? "bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {statusText}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4" ref={(el) => (tiltRefs.current[1] = el)}>
            <h3 className="relative inline-block font-semibold text-lg">
              Quick Links
              <div className="absolute -bottom-1 left-0 w-8 h-[2px] bg-gradient-to-r from-primary to-transparent" />
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Login", path: "/login" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="group flex items-center space-x-2 text-accent-foreground/90 hover:text-primary transition-all duration-300"
                  >
                    <div className="w-1 h-1 rounded-full bg-primary/50 group-hover:w-4 group-hover:bg-primary transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4" ref={(el) => (tiltRefs.current[2] = el)}>
            <h3 className="relative inline-block font-semibold text-lg">
              Contact Us
              <div className="absolute -bottom-1 left-0 w-8 h-[2px] bg-gradient-to-r from-primary to-transparent" />
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p>7308 Aspen Ln N, Suite 155-157</p>
                    <p>Brooklyn Park, MN 55428</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
                <a href="tel:+16123918366" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+1 612-391-8366</span>
                </a>
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
                <a href="mailto:sales@osaritrading.com" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>sales@osaritrading.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4" ref={(el) => (tiltRefs.current[3] = el)}>
            <h3 className="relative inline-block font-semibold text-lg">
              Business Hours
              <div className="absolute -bottom-1 left-0 w-8 h-[2px] bg-gradient-to-r from-primary to-transparent" />
            </h3>
            <div className="space-y-2">
              {[
                { day: "Monday – Friday", hours: "9:00 AM – 5:00 PM", open: true },
                { day: "Saturday", hours: "9:00 AM – 4:00 PM", open: true },
                { day: "Sunday", hours: "Closed", open: false },
              ].map((d, i) => (
                <div
                  key={i}
                  className="flex justify-between p-2 rounded-md bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all duration-300"
                >
                  <span>{d.day}</span>
                  <span className={d.open ? "text-primary" : "text-muted-foreground"}>
                    {d.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-primary/20 text-center text-accent-foreground/70 text-sm">
          © {currentYear} Osari Trading. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
