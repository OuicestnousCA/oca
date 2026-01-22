import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import { useMemo, useState } from "react";

const NEW_BADGE_COUNT = 4;

const ProductGrid = () => {
  const [sort, setSort] = useState<
    "popularity" | "latest" | "low-high" | "high-low"
  >("latest");

  const newProductIds = useMemo(() => {
    const newest = [...products]
      .sort((a, b) => b.id - a.id)
      .slice(0, NEW_BADGE_COUNT)
      .map((p) => p.id);
    return new Set(newest);
  }, []);

  const displayedProducts = useMemo(() => {
    const list = [...products];

    switch (sort) {
      case "low-high":
        return list.sort((a, b) => a.price - b.price);
      case "high-low":
        return list.sort((a, b) => b.price - a.price);
      case "popularity":
        // Use best-seller / selling-fast flags as a simple popularity signal when present.
        return list.sort((a, b) => {
          const aScore = Number(Boolean((a as any).isBestSeller)) * 2 + Number(Boolean((a as any).isSelling));
          const bScore = Number(Boolean((b as any).isBestSeller)) * 2 + Number(Boolean((b as any).isSelling));
          return bScore - aScore;
        });
      case "latest":
      default:
        // Always show newest-added products first (higher IDs are treated as newer).
        return list.sort((a, b) => b.id - a.id);
    }
  }, [sort]);

  return (
    <section id="products" className="py-16 md:py-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <p className="text-muted-foreground">
            Showing all {displayedProducts.length} results
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <select
              className="bg-background border border-border px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-foreground"
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value as
                    | "popularity"
                    | "latest"
                    | "low-high"
                    | "high-low"
                )
              }
              aria-label="Sort products"
            >
              <option value="popularity">Sort by popularity</option>
              <option value="latest">Sort by latest</option>
              <option value="low-high">Sort by price: low to high</option>
              <option value="high-low">Sort by price: high to low</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isNew={newProductIds.has(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
