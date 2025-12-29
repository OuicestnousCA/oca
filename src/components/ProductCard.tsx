import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import type { Product, ColorVariant } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<ColorVariant | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const displayImage = hoveredColor?.image || product.image;
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (amount: number) => {
    return `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.image 
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <article 
      className="group relative bg-card cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredColor(null);
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {/* Main Product Image */}
        <img 
          src={displayImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Icons */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          {/* Add to Cart Icon */}
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 flex items-center justify-center bg-background/90 backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 flex items-center justify-center bg-background/90 backdrop-blur-sm transition-all duration-300 ${
              isWishlisted 
                ? "text-[hsl(var(--accent))]" 
                : "hover:text-[hsl(var(--accent))]"
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className="w-4 h-4" 
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Discount Badge */}
        {product.isOnSale && discountPercentage > 0 && (
          <span className="absolute bottom-3 left-3 px-2 py-1 text-xs font-semibold bg-background text-foreground">
            -{discountPercentage}%
          </span>
        )}

        {/* Color Swatches on Hover */}
        {isHovered && product.colors.length > 1 && (
          <div 
            className="absolute bottom-3 right-3 flex gap-1.5 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {product.colors.map((color) => (
              <button
                key={color.name}
                onMouseEnter={() => setHoveredColor(color)}
                onMouseLeave={() => setHoveredColor(null)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  hoveredColor?.name === color.name
                    ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    : "border-background shadow-md"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={`View ${color.name} color`}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4 space-y-1.5">
        <h3 className="font-display text-lg tracking-wide leading-tight line-clamp-1">
          {product.name}
        </h3>
        
        {/* Price Row */}
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${product.originalPrice ? "text-[hsl(var(--accent))]" : ""}`}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="line-through text-muted-foreground text-sm">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Category */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.category}
        </p>

        {/* Colors Count */}
        {product.colors.length > 1 && (
          <p className="text-xs text-muted-foreground">
            {product.colors.length} Colours
          </p>
        )}
        
        {/* Selling Fast Indicator */}
        {product.isSelling && (
          <p className="text-xs font-semibold text-foreground pt-1">
            Selling Fast
          </p>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
