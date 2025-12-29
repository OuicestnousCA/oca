import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, Heart, Minus, Plus, Star, Truck, RotateCcw, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProductById, getRelatedProducts, getAlsoBoughtProducts, type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const product = getProductById(Number(id));
  
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: selectedColor?.image || product.image,
      category: product.category,
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.id, product.category);
  const alsoBoughtProducts = getAlsoBoughtProducts(product.id);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (amount: number) => {
    return `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: selectedColor?.image || product.image,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const displayImage = selectedColor?.image || product.image;

  return (
    <>
      <Helmet>
        <title>{product.name} | Shop</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container mb-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">{product.category}</span>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Section */}
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image with Zoom */}
              <div 
                className="relative aspect-square bg-secondary overflow-hidden cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={displayImage}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isZoomed ? "scale-150" : "scale-100"
                  }`}
                  style={isZoomed ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  } : undefined}
                />
                
                {/* Discount Badge */}
                {product.isOnSale && discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 text-sm font-semibold bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
                    -{discountPercentage}%
                  </span>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-secondary overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? "border-foreground" 
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                  {product.category}
                </p>
                <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.reviews.rating)
                            ? "fill-foreground text-foreground"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.reviews.rating} ({product.reviews.count} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className={`text-3xl font-semibold ${product.originalPrice ? "text-[hsl(var(--accent))]" : ""}`}>
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl line-through text-muted-foreground">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Selling Fast */}
              {product.isSelling && (
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full animate-pulse" />
                  Selling Fast
                </p>
              )}

              {/* Color Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Color</span>
                  <span className="text-sm text-muted-foreground">{selectedColor?.name}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                        selectedColor?.name === color.name
                          ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background"
                          : "border-muted hover:border-foreground"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={`Select ${color.name} color`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Size</span>
                  <button className="text-sm text-muted-foreground underline hover:text-foreground transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-12 px-4 text-sm font-medium border transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-muted-foreground">Please select a size</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center border border-border w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center font-medium border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className="flex-1 h-14 btn-primary"
                >
                  Add to Cart
                </Button>
                <button
                  onClick={handleToggleWishlist}
                  className={`w-14 h-14 flex items-center justify-center border transition-all ${
                    isWishlisted 
                      ? "border-[hsl(var(--accent))] text-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10" 
                      : "border-border hover:border-foreground"
                  }`}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Buy Now */}
              <Button
                onClick={() => {
                  handleAddToCart();
                  navigate("/checkout");
                }}
                disabled={!selectedSize}
                className="w-full h-14 btn-outline"
                variant="outline"
              >
                Buy Now
              </Button>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center space-y-2">
                  <Truck className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center space-y-2">
                  <RotateCcw className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Easy Returns</p>
                </div>
                <div className="text-center space-y-2">
                  <Shield className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Secure Payment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description & Details */}
          <div className="mt-16 pt-16 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-display text-2xl mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div>
                <h2 className="font-display text-2xl mb-4">Product Details</h2>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 pt-16 border-t border-border">
            <h2 className="font-display text-3xl mb-8">Reviews & Ratings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="text-center p-8 bg-secondary">
                <div className="text-5xl font-display mb-2">{product.reviews.rating}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.reviews.rating)
                          ? "fill-foreground text-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {product.reviews.count} reviews
                </p>
              </div>

              {/* Sample Reviews */}
              <div className="md:col-span-2 space-y-6">
                {[
                  { name: "Alex M.", rating: 5, date: "2 days ago", comment: "Excellent quality! The fit is perfect and the material feels premium. Highly recommend." },
                  { name: "Jordan K.", rating: 4, date: "1 week ago", comment: "Great product overall. Shipping was fast and packaging was eco-friendly. Will buy again." },
                  { name: "Sam T.", rating: 5, date: "2 weeks ago", comment: "Love the design and comfort. True to size and looks even better in person." },
                ].map((review, index) => (
                  <div key={index} className="border-b border-border pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-medium">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "fill-foreground text-foreground"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-16 border-t border-border">
              <h2 className="font-display text-3xl mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Customers Also Bought */}
          <div className="mt-16 pt-16 border-t border-border">
            <h2 className="font-display text-3xl mb-8">Customers Also Bought</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {alsoBoughtProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetail;
