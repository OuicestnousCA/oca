import ProductCard from "./ProductCard";
import { products } from "@/data/products";

const ProductGrid = () => {
  return (
    <section id="products" className="py-16 md:py-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <p className="text-muted-foreground">
            Showing all {products.length} results
          </p>
          <select 
            className="bg-background border border-border px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-foreground"
            defaultValue="latest"
          >
            <option value="popularity">Sort by popularity</option>
            <option value="latest">Sort by latest</option>
            <option value="low-high">Sort by price: low to high</option>
            <option value="high-low">Sort by price: high to low</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
