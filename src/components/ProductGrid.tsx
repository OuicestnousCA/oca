import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { products } from "@/data/products";

const ProductGrid = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("latest");

  // Initialize price range with actual min/max from products
  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by color
    if (selectedColors.length > 0) {
      result = result.filter(p => 
        p.colors.some(c => selectedColors.includes(c.name))
      );
    }

    // Filter by price range
    const [min, max] = priceRange[0] === 0 && priceRange[1] === 1000 
      ? [minPrice, maxPrice] 
      : priceRange;
    result = result.filter(p => p.price >= min && p.price <= max);

    // Sort
    switch (sortBy) {
      case "low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        result.sort((a, b) => b.reviews.count - a.reviews.count);
        break;
      case "latest":
      default:
        // Keep original order for latest
        break;
    }

    return result;
  }, [selectedCategories, selectedColors, priceRange, sortBy, minPrice, maxPrice]);

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setPriceRange([minPrice, maxPrice]);
  };

  // Set initial price range on mount
  useState(() => {
    setPriceRange([minPrice, maxPrice]);
  });

  return (
    <section id="products" className="py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <ProductFilters
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            priceRange={priceRange[0] === 0 ? [minPrice, maxPrice] : priceRange}
            setPriceRange={setPriceRange}
            onClearAll={handleClearFilters}
          />

          {/* Products */}
          <div className="flex-1">
            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedColors.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}
                    className="flex items-center gap-1 px-3 py-1 bg-muted text-sm"
                  >
                    {cat}
                    <span className="ml-1">×</span>
                  </button>
                ))}
                {selectedColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}
                    className="flex items-center gap-1 px-3 py-1 bg-muted text-sm"
                  >
                    {color}
                    <span className="ml-1">×</span>
                  </button>
                ))}
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} results
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-border px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="popularity">Sort by popularity</option>
                <option value="latest">Sort by latest</option>
                <option value="low-high">Sort by price: low to high</option>
                <option value="high-low">Sort by price: high to low</option>
              </select>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">No products found</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 border border-border text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
