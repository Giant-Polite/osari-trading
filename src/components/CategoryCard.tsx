import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Category } from "@/api/products";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/products?category=${category.slug}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
            <p className="text-sm opacity-90 mb-3">{category.description}</p>
            <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform">
              <span className="font-semibold">Shop Now</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
