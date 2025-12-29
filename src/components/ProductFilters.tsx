import { useState } from "react";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { products } from "@/data/products";

interface ProductFiltersProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onClearAll: () => void;
}

const ProductFilters = ({
  selectedCategories,
  setSelectedCategories,
  selectedColors,
  setSelectedColors,
  priceRange,
  setPriceRange,
  onClearAll,
}: ProductFiltersProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("category");

  // Extract unique categories and colors from products
  const categories = [...new Set(products.map(p => p.category))];
  const allColors = products.flatMap(p => p.colors.map(c => ({ name: c.name, hex: c.hex })));
  const uniqueColors = allColors.filter((color, index, self) =>
    index === self.findIndex(c => c.name === color.name)
  );

  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedColors.length > 0 || 
    priceRange[0] > minPrice || priceRange[1] < maxPrice;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="border-b border-border pb-6">
        <button
          onClick={() => setOpenSection(openSection === "category" ? null : "category")}
          className="flex items-center justify-between w-full text-left font-medium mb-4"
        >
          Category
          <ChevronDown className={`w-4 h-4 transition-transform ${openSection === "category" ? "rotate-180" : ""}`} />
        </button>
        {openSection === "category" && (
          <div className="space-y-3">
            {categories.map(category => (
              <label key={category} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 border-2 border-border rounded-none accent-foreground"
                />
                <span className="text-sm group-hover:text-foreground transition-colors">
                  {category}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  ({products.filter(p => p.category === category).length})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-border pb-6">
        <button
          onClick={() => setOpenSection(openSection === "price" ? null : "price")}
          className="flex items-center justify-between w-full text-left font-medium mb-4"
        >
          Price Range
          <ChevronDown className={`w-4 h-4 transition-transform ${openSection === "price" ? "rotate-180" : ""}`} />
        </button>
        {openSection === "price" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  min={minPrice}
                  max={priceRange[1]}
                  className="w-full px-3 py-2 text-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
              <span className="text-muted-foreground mt-5">—</span>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  min={priceRange[0]}
                  max={maxPrice}
                  className="w-full px-3 py-2 text-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-foreground"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₦{minPrice.toLocaleString()}</span>
              <span>₦{maxPrice.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="pb-6">
        <button
          onClick={() => setOpenSection(openSection === "color" ? null : "color")}
          className="flex items-center justify-between w-full text-left font-medium mb-4"
        >
          Color
          <ChevronDown className={`w-4 h-4 transition-transform ${openSection === "color" ? "rotate-180" : ""}`} />
        </button>
        {openSection === "color" && (
          <div className="flex flex-wrap gap-2">
            {uniqueColors.map(color => (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                className={`flex items-center gap-2 px-3 py-2 border text-sm transition-colors ${
                  selectedColors.includes(color.name)
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear All */}
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="w-full py-3 border border-border text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <h3 className="text-lg font-semibold mb-6">Filters</h3>
        <FilterContent />
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 w-5 h-5 bg-foreground text-background text-xs flex items-center justify-center">
              {selectedCategories.length + selectedColors.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setIsMobileOpen(false)} className="icon-btn">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;
