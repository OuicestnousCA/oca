import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  isOnSale?: boolean;
}

const ProductCard = ({ id, name, price, originalPrice, image, isOnSale }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  const formatPrice = (amount: number) => {
    return `R${amount.toFixed(2).replace('.', ',')}`;
  };

  const handleAddToCart = () => {
    addToCart({ id, name, price, image });
  };

  return (
    <article className="product-card group">
      <div className="product-image-wrapper">
        <img 
          src={image} 
          alt={name}
          className="product-image"
          loading="lazy"
        />
        {isOnSale && (
          <span className="sale-badge">Sale!</span>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg tracking-wide">{name}</h3>
        <div className="mt-2 flex items-center gap-2">
          {originalPrice && (
            <span className="price-original">{formatPrice(originalPrice)}</span>
          )}
          <span className={originalPrice ? "price-sale" : "font-medium"}>
            {formatPrice(price)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
