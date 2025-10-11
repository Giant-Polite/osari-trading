// /src/pages/Contact.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePremiumToast } from "@/hooks/usePremiumToast";
import { ToastContainer } from "@/components/PremiumToast";
import { Mail, Phone, MapPin, Clock, Trash2 } from "lucide-react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const { toasts, showToast, removeToast } = usePremiumToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist formData to localStorage on change
  useEffect(() => {
    localStorage.setItem("contactFormData", JSON.stringify(formData));
  }, [formData]);

  // Load persisted form + append cart/contactProduct on mount
  useEffect(() => {
    const savedForm = localStorage.getItem("contactFormData");
    if (savedForm) setFormData(JSON.parse(savedForm));

    const cart = JSON.parse(localStorage.getItem("cartProducts") || "[]") as string[];
    const contactProduct = localStorage.getItem("contactProduct");

    if (contactProduct) {
      const currentCart = cart.includes(contactProduct) ? cart : [...cart, contactProduct];
      localStorage.setItem("cartProducts", JSON.stringify(currentCart));
      localStorage.removeItem("contactProduct");
    }

    const updatedCart = JSON.parse(localStorage.getItem("cartProducts") || "[]") as string[];
    if (updatedCart.length > 0) {
      const cartSummary =
        updatedCart.length === 1
          ? `\n\nInterested in: ${updatedCart[0]}`
          : `\n\nInterested in: ${updatedCart.join(", ")}`;
      setFormData((prev) => ({
        ...prev,
        message: prev.message ? prev.message + cartSummary : cartSummary,
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearCart = () => {
    localStorage.removeItem("cartProducts");
    setFormData((prev) => ({
      ...prev,
      message: prev.message.replace(/\n\nInterested in:.*$/s, ""),
    }));
    showToast({
      title: "Cart Cleared",
      description: "Products removed from inquiry.",
      variant: "info",
      duration: 2500,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        "service_lbav6nz",
        "template_kk7hr85",
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "4A16-a1r2QNyqkRSx"
      );

      showToast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you promptly.",
        variant: "success",
        duration: 3500,
      });

      setFormData({ name: "", email: "", message: "" });
      localStorage.removeItem("cartProducts");
      localStorage.removeItem("contactFormData");
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "error",
        duration: 3500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCart = JSON.parse(localStorage.getItem("cartProducts") || "[]") as string[];

  return (
    <>
      {/* Toast container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              We're here to help! Whether you're a restaurant, grocery store, or local business,
              reach out for inquiries, wholesale orders, or general questions. Fill out the form below,
              and we'll get back to you promptly.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <form onSubmit={handleSubmit} className="bg-card rounded-lg p-8 shadow-lg animate-fade-in">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    {currentCart.length > 0 && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Cart items added:</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearCart}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Clear
                        </Button>
                      </div>
                    )}
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us about your inquiry, wholesale needs, or questions..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#FFD700] text-[#8B4513] hover:bg-[#FFD700]/90 hover:shadow-lg transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="bg-card rounded-lg p-8 shadow-md animate-fade-in">
                <p className="text-lg mb-8 leading-relaxed text-muted-foreground">
                  Family-owned and operated, committed to serving Minneapolis and the Midwest with dedication and excellence.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#8A9A5B]/10 rounded-full p-3 flex-shrink-0">
                      <MapPin className="h-6 w-6 text-[#8A9A5B]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Address</h3>
                      <p className="text-muted-foreground">
                        7308 Aspen Ln N<br />
                        Suite 155-157<br />
                        Brooklyn Park, MN 55428
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#8A9A5B]/10 rounded-full p-3 flex-shrink-0">
                      <Phone className="h-6 w-6 text-[#8A9A5B]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Phone</h3>
                      <p className="text-muted-foreground">
                        <a href="tel:+16123918366" className="hover:text-[#8A9A5B] transition-colors">
                          +1 612-391-8366
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#8A9A5B]/10 rounded-full p-3 flex-shrink-0">
                      <Clock className="h-6 w-6 text-[#8A9A5B]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Mon – Fri: 9:00 AM – 5:00 PM</p>
                        <p>Sat: 9:00 AM – 4:00 PM</p>
                        <p>Sun: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
