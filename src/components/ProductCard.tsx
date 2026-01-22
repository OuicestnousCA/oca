import { useState, useRef } from "react";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Product, ColorVariant } from "@/data/products";

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
}

const ProductCard = ({ product, isNew = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [hoveredColor, setHoveredColor] = useState<ColorVariant | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const isWishlisted = isInWishlist(product.id);
  
  // Check if product has unique images (not all the same)
  const hasUniqueImages = product.images.length > 1 && 
    new Set(product.images).size > 1;
  
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

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      (prev + 1) % product.images.length
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next image
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      } else {
        // Swipe right - previous image
        setCurrentImageIndex((prev) => 
          prev === 0 ? product.images.length - 1 : prev - 1
        );
      }
    }
    
    touchStartX.current = null;
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
        {/* NEW Badge */}
        {isNew && (
          <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold tracking-widest bg-primary text-primary-foreground z-10">
            NEW
          </span>
        )}

        {/* Image Slider */}
        {hasUniqueImages ? (
          <div 
            className="relative w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {product.images.map((img, index) => (
              <img 
                key={index}
                src={hoveredColor?.image || img} 
                alt={`${product.name} - View ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${
                  index === currentImageIndex 
                    ? "opacity-100 translate-x-0" 
                    : index < currentImageIndex 
                      ? "opacity-0 -translate-x-full" 
                      : "opacity-0 translate-x-full"
                }`}
                loading="lazy"
              />
            ))}
            
            {/* Navigation Arrows - Show on hover */}
            {isHovered && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300 hover:bg-background z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300 hover:bg-background z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            
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
      <div className="p-4 space-y-1.5 text-center">
        <h3 className="font-display text-lg tracking-wide leading-tight line-clamp-1">
          {product.name}
        </h3>
        
        {/* Price Row */}
        <div className="flex items-center justify-center gap-2">
          <span className={`font-semibold ${product.originalPrice ? "text-[hsl(var(--accent))]" : ""}`}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="line-through text-muted-foreground text-sm">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
