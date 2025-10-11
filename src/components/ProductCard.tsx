import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/api/products";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="
        group 
        overflow-hidden 
        rounded-xl 
        transition-transform 
        duration-300 
        hover:scale-105 
        hover:shadow-2xl 
        hover:shadow-[#FFD700]/40 
        animate-scale-in 
        cursor-pointer
        w-full
        max-w-[160px] sm:max-w-none
      "
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square rounded-t-xl flex items-center justify-center bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-2 sm:p-4 bg-gradient-to-t from-white/90 to-transparent">
        <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 hover:text-[#8A9A5B] transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
          {product.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
