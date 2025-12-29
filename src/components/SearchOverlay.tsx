import { useEffect, useRef } from "react";
import { X, Search } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { products } from "@/data/products";
import { Link } from "react-router-dom";

const SearchOverlay = () => {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeSearch]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-sm animate-fade-in">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">Search</h2>
          <button onClick={closeSearch} className="icon-btn" aria-label="Close search">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full pl-12 pr-4 py-4 text-lg bg-muted/50 border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        {/* Results */}
        {searchQuery && (
          <div>
            <p className="text-sm text-muted-foreground mb-6">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for "{searchQuery}"
            </p>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.slice(0, 8).map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={closeSearch}
                    className="group"
                  >
                    <div className="aspect-[3/4] bg-muted mb-3 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-sm font-semibold mt-1">₦{product.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No products found. Try a different search term.
              </p>
            )}
          </div>
        )}

        {/* Quick Links */}
        {!searchQuery && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Popular Categories</h3>
            <div className="flex flex-wrap gap-2">
              {["Hoodies", "T-Shirts", "Jerseys", "Outerwear", "Accessories"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSearchQuery(cat)}
                  className="px-4 py-2 border border-border text-sm hover:bg-foreground hover:text-background transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
