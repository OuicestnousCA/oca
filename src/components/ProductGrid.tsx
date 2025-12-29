import ProductCard from "./ProductCard";

// Product images
import hoodieBlack from "@/assets/products/hoodie-black.jpg";
import teePink from "@/assets/products/tee-pink.jpg";
import jerseyWhite from "@/assets/products/jersey-white.jpg";
import jerseyBlack from "@/assets/products/jersey-black.jpg";
import pufferBlue from "@/assets/products/puffer-blue.jpg";
import capPink from "@/assets/products/cap-pink.jpg";
import shortsBlack from "@/assets/products/shorts-black.jpg";
import teeBlack from "@/assets/products/tee-black.jpg";

const products = [
  {
    id: 1,
    name: "YBY O Hoodie",
    price: 499.99,
    originalPrice: 699.99,
    image: hoodieBlack,
    isOnSale: true,
  },
  {
    id: 2,
    name: "1999 O Pink Tee",
    price: 299.99,
    image: teePink,
    isOnSale: false,
  },
  {
    id: 3,
    name: "BTL OFC Jersey White",
    price: 399.99,
    image: jerseyWhite,
    isOnSale: false,
  },
  {
    id: 4,
    name: "BTL OFC Jersey Black",
    price: 399.99,
    image: jerseyBlack,
    isOnSale: false,
  },
  {
    id: 5,
    name: "Bleu O Puffer Jacket",
    price: 799.99,
    image: pufferBlue,
    isOnSale: false,
  },
  {
    id: 6,
    name: "OTE Pink Trucker Cap",
    price: 199.99,
    originalPrice: 249.99,
    image: capPink,
    isOnSale: true,
  },
  {
    id: 7,
    name: "Squeeze O Short",
    price: 399.99,
    originalPrice: 499.99,
    image: shortsBlack,
    isOnSale: true,
  },
  {
    id: 8,
    name: "DTS O Tee",
    price: 399.99,
    image: teeBlack,
    isOnSale: false,
  },
];

const ProductGrid = () => {
  return (
    <section id="products" className="py-16 md:py-24">
      <div className="container">
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
