import { useState, useEffect } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Product, ColorVariant } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [hoveredColor, setHoveredColor] = useState<ColorVariant | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isWishlisted = isInWishlist(product.id);
  
  // Check if product has unique images (not all the same)
  const hasUniqueImages = product.images.length > 1 && 
    new Set(product.images).size > 1;
  
  // Auto-slide effect for products with multiple unique images
  useEffect(() => {
    if (!hasUniqueImages) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [hasUniqueImages, product.images.length]);
  
  const displayImage = hoveredColor?.image || 
    (hasUniqueImages ? product.images[currentImageIndex] : product.image);
  
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
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
    });
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <article 
      className="group relative bg-card cursor-pointer w-[250px]"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredColor(null);
      }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-secondary" style={{ width: '250px', height: '373px' }}>
        {/* Image Slider */}
        {hasUniqueImages ? (
          <div className="relative w-full h-full">
            {product.images.map((img, index) => (
              <img 
                key={index}
                src={hoveredColor?.image || img} 
                alt={`${product.name} - View ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                  index === currentImageIndex 
                    ? "opacity-100 translate-x-0" 
                    : index < currentImageIndex 
                      ? "opacity-0 -translate-x-full" 
                      : "opacity-0 translate-x-full"
                }`}
                loading="lazy"
              />
            ))}
            
            {/* Slide Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? "bg-foreground w-4" 
                      : "bg-foreground/40 hover:bg-foreground/60"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <img 
            src={displayImage} 
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        )}

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
          <span className="absolute bottom-3 left-3 px-2 py-1 text-xs font-semibold bg-background text-foreground z-10">
            -{discountPercentage}%
          </span>
        )}

        {/* Color Swatches on Hover */}
        {isHovered && product.colors.length > 1 && !hasUniqueImages && (
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
