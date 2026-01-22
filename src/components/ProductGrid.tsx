import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import { useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ProductGrid = () => {
  const [newArrivals, setNewArrivals] = useState(false);
  const [sort, setSort] = useState<
    "popularity" | "latest" | "low-high" | "high-low"
  >("latest");

  const displayedProducts = useMemo(() => {
    const list = [...products];

    // "New Arrivals" forces newest-first ordering without changing the source array.
    // Since we don't have timestamps in the local catalog, we treat higher IDs as newer.
    if (newArrivals) {
      return list.sort((a, b) => b.id - a.id);
    }

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
        // Default "latest" keeps the catalog order as authored.
        return list;
    }
  }, [newArrivals, sort]);

  return (
    <section id="products" className="py-16 md:py-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <p className="text-muted-foreground">
            Showing all {displayedProducts.length} results
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="new-arrivals"
                checked={newArrivals}
                onCheckedChange={setNewArrivals}
                aria-label="Toggle New Arrivals"
              />
              <Label htmlFor="new-arrivals" className="text-sm font-medium">
                New Arrivals
              </Label>
            </div>

            <select
              className="bg-background border border-border px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-60"
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
              disabled={newArrivals}
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
