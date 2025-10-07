import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/api/products";

interface ProductCardProps {
  product: Product;
  onClick?: () => void; // 👈 new optional prop
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="group overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD700]/40 animate-scale-in cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-square rounded-t-xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      <CardContent className="p-4 bg-gradient-to-t from-white/90 to-transparent">
        <h3 className="font-semibold text-lg mb-2 hover:text-[#8A9A5B] transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
