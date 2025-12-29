import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ColorVariant {
  name: string;
  hex: string;
}

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  isOnSale?: boolean;
  colors?: ColorVariant[];
  sizes?: string[];
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  originalPrice, 
  image, 
  isOnSale,
  colors = [],
  sizes = []
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState("");
  
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
      
      <div className="p-4 space-y-3">
        <h3 className="font-display text-lg tracking-wide">{name}</h3>
        
        {/* Color Swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                  selectedColor === color.name 
                    ? "border-foreground scale-110" 
                    : "border-transparent hover:scale-110"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={`Select ${color.name} color`}
                title={color.name}
              />
            ))}
          </div>
        )}
        
        {/* Size Swatches */}
        {sizes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[32px] h-7 px-2 text-xs font-medium border transition-all duration-200 ${
                  selectedSize === size 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background text-foreground border-border hover:border-foreground"
                }`}
                aria-label={`Select size ${size}`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2 pt-1">
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
