import { Wheat, Wine, Award, Users } from "lucide-react";

const About = () => {
  const stats = [
    { label: "Generations of Experience", value: "3+", icon: Award },
    { label: "Products Supplied", value: "500+", icon: Wheat },
    { label: "Trusted Clients", value: "100+", icon: Users },
    { label: "Minneapolis & Midwest", value: "MN", icon: Wine },
  ];

  const highlights = [
    { icon: "🌾", text: "Premium Grains & Raw Foods" },
    { icon: "🥤", text: "Beverages at Wholesale Scale" },
    { icon: "🕌", text: "Certified Halal Products You Can Trust" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
            Family-Run Wholesale Excellence
          </h2>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16 animate-fade-in">
          <div className="bg-card rounded-lg p-8 md:p-12 shadow-lg">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Osari Trading LLC is a family-owned wholesale business proudly serving Minneapolis and the Midwest. 
                With three generations of experience, we specialize in sourcing and distributing premium food, beverages, 
                and certified Halal products. Our mission is simple: to deliver the highest quality products at competitive 
                prices, while building trusted relationships with our clients.
              </p>
              <p>
                From raw grains and spices to beverages and halal-certified items, we are committed to meeting the diverse 
                needs of restaurants, grocery stores, and local businesses. What sets us apart is our dedication to 
                authenticity and service. Every product we supply is carefully chosen to ensure freshness, quality, and 
                compliance with halal standards.
              </p>
              <p>
                At Osari Trading LLC, you're not just a customer — you're part of our extended family.
              </p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-6 shadow-md text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="font-medium text-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Container */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
