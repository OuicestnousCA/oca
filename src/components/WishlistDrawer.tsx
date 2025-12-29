import { Heart, X, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

const WishlistDrawer = () => {
  const navigate = useNavigate();
  const { items, isOpen, closeWishlist, removeFromWishlist, totalItems } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (amount: number) => {
    return `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
  };

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    removeFromWishlist(item.id);
  };

  const handleViewProduct = (id: number) => {
    closeWishlist();
    navigate(`/product/${id}`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeWishlist}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-display text-2xl tracking-wide flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Wishlist ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="font-display text-xl mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Save items you love for later
            </p>
            <Button onClick={closeWishlist} className="btn-primary">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-secondary/50 group"
                >
                  <button
                    onClick={() => handleViewProduct(item.id)}
                    className="w-24 h-24 bg-secondary flex-shrink-0 overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                  
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <button
                        onClick={() => handleViewProduct(item.id)}
                        className="font-display text-sm tracking-wide line-clamp-1 text-left hover:underline"
                      >
                        {item.name}
                      </button>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                        {item.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-sm font-semibold ${item.originalPrice ? "text-[hsl(var(--accent))]" : ""}`}>
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs line-through text-muted-foreground">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex items-center gap-1.5 text-xs font-medium hover:text-[hsl(var(--accent))] transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Move to Cart
                      </button>
                      <span className="text-muted-foreground">|</span>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <Button
                onClick={closeWishlist}
                className="w-full h-12 btn-primary"
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;
