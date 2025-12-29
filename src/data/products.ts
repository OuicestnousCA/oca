// Product images
import hoodieBlack from "@/assets/products/hoodie-black.jpg";
import teePink from "@/assets/products/tee-pink.jpg";
import jerseyWhite from "@/assets/products/jersey-white.jpg";
import jerseyBlack from "@/assets/products/jersey-black.jpg";
import pufferBlue from "@/assets/products/puffer-blue.jpg";
import capPink from "@/assets/products/cap-pink.jpg";
import shortsBlack from "@/assets/products/shorts-black.jpg";
import teeBlack from "@/assets/products/tee-black.jpg";

export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  isOnSale?: boolean;
  isSelling?: boolean;
  category: string;
  colors: ColorVariant[];
  sizes: string[];
  description: string;
  details: string[];
  reviews: {
    rating: number;
    count: number;
  };
}

export const products: Product[] = [
  {
    id: 1,
    name: "YBY O Hoodie",
    price: 499.99,
    originalPrice: 699.99,
    image: hoodieBlack,
    images: [hoodieBlack, hoodieBlack, hoodieBlack],
    isOnSale: true,
    isSelling: true,
    category: "Hoodies",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: hoodieBlack },
      { name: "Charcoal", hex: "#3d3d3d", image: hoodieBlack },
      { name: "Navy", hex: "#1e3a5f", image: hoodieBlack },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Premium heavyweight hoodie crafted from 100% organic cotton. Features a relaxed fit with ribbed cuffs and hem for comfort and durability.",
    details: [
      "100% Organic Cotton",
      "Heavyweight 400gsm fabric",
      "Relaxed fit",
      "Kangaroo pocket",
      "Ribbed cuffs and hem",
      "Machine washable"
    ],
    reviews: { rating: 4.8, count: 124 }
  },
  {
    id: 2,
    name: "1999 O Pink Tee",
    price: 299.99,
    image: teePink,
    images: [teePink, teePink, teePink],
    isOnSale: false,
    isSelling: false,
    category: "T-Shirts",
    colors: [
      { name: "Pink", hex: "#e8a0b5", image: teePink },
      { name: "White", hex: "#ffffff", image: teePink },
      { name: "Black", hex: "#1a1a1a", image: teePink },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Vintage-inspired graphic tee with a soft hand feel. The relaxed silhouette and premium cotton blend make it perfect for everyday wear.",
    details: [
      "95% Cotton, 5% Elastane",
      "200gsm fabric weight",
      "Relaxed fit",
      "Screen-printed graphic",
      "Reinforced shoulder seams",
      "Pre-shrunk"
    ],
    reviews: { rating: 4.6, count: 89 }
  },
  {
    id: 3,
    name: "BTL OFC Jersey White",
    price: 399.99,
    image: jerseyWhite,
    images: [jerseyWhite, jerseyWhite, jerseyWhite],
    isOnSale: false,
    isSelling: true,
    category: "Jerseys",
    colors: [
      { name: "White", hex: "#ffffff", image: jerseyWhite },
      { name: "Black", hex: "#1a1a1a", image: jerseyBlack },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Official team jersey featuring moisture-wicking technology. Designed for performance with breathable mesh panels.",
    details: [
      "100% Recycled Polyester",
      "Moisture-wicking technology",
      "Mesh ventilation panels",
      "Athletic fit",
      "Embroidered logo",
      "Quick-dry fabric"
    ],
    reviews: { rating: 4.9, count: 203 }
  },
  {
    id: 4,
    name: "BTL OFC Jersey Black",
    price: 399.99,
    image: jerseyBlack,
    images: [jerseyBlack, jerseyBlack, jerseyBlack],
    isOnSale: false,
    isSelling: false,
    category: "Jerseys",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: jerseyBlack },
      { name: "White", hex: "#ffffff", image: jerseyWhite },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Official team jersey featuring moisture-wicking technology. Designed for performance with breathable mesh panels.",
    details: [
      "100% Recycled Polyester",
      "Moisture-wicking technology",
      "Mesh ventilation panels",
      "Athletic fit",
      "Embroidered logo",
      "Quick-dry fabric"
    ],
    reviews: { rating: 4.7, count: 156 }
  },
  {
    id: 5,
    name: "Bleu O Puffer Jacket",
    price: 799.99,
    image: pufferBlue,
    images: [pufferBlue, pufferBlue, pufferBlue],
    isOnSale: false,
    isSelling: false,
    category: "Outerwear",
    colors: [
      { name: "Blue", hex: "#3a6ea5", image: pufferBlue },
      { name: "Black", hex: "#1a1a1a", image: pufferBlue },
      { name: "Olive", hex: "#556b2f", image: pufferBlue },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Insulated puffer jacket with premium down filling. Features a water-resistant shell and adjustable hood for ultimate protection.",
    details: [
      "80% Down, 20% Feather fill",
      "Water-resistant nylon shell",
      "Adjustable hood",
      "Two-way zipper",
      "Internal zippered pocket",
      "Packable design"
    ],
    reviews: { rating: 4.5, count: 67 }
  },
  {
    id: 6,
    name: "OTE Pink Trucker Cap",
    price: 199.99,
    originalPrice: 249.99,
    image: capPink,
    images: [capPink, capPink, capPink],
    isOnSale: true,
    isSelling: false,
    category: "Accessories",
    colors: [
      { name: "Pink", hex: "#e8a0b5", image: capPink },
      { name: "Black", hex: "#1a1a1a", image: capPink },
      { name: "White", hex: "#ffffff", image: capPink },
    ],
    sizes: ["One Size"],
    description: "Classic trucker cap with curved brim and mesh back. Features an adjustable snapback closure for the perfect fit.",
    details: [
      "Cotton front panel",
      "Mesh back panels",
      "Curved brim",
      "Snapback closure",
      "Embroidered logo",
      "One size fits most"
    ],
    reviews: { rating: 4.4, count: 45 }
  },
  {
    id: 7,
    name: "Squeeze O Short",
    price: 399.99,
    originalPrice: 499.99,
    image: shortsBlack,
    images: [shortsBlack, shortsBlack, shortsBlack],
    isOnSale: true,
    isSelling: true,
    category: "Bottoms",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: shortsBlack },
      { name: "Grey", hex: "#6b6b6b", image: shortsBlack },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Athletic shorts with built-in compression liner. Designed for high-performance training with moisture management.",
    details: [
      "90% Polyester, 10% Spandex",
      "Built-in compression liner",
      "Moisture-wicking fabric",
      "Side zippered pockets",
      "Reflective details",
      "7-inch inseam"
    ],
    reviews: { rating: 4.7, count: 112 }
  },
  {
    id: 8,
    name: "DTS O Tee",
    price: 399.99,
    image: teeBlack,
    images: [teeBlack, teeBlack, teeBlack],
    isOnSale: false,
    isSelling: false,
    category: "T-Shirts",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: teeBlack },
      { name: "White", hex: "#ffffff", image: teeBlack },
      { name: "Grey", hex: "#6b6b6b", image: teeBlack },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Elevated basics tee with a structured fit. Premium heavyweight cotton delivers a luxurious feel and lasting durability.",
    details: [
      "100% Premium Cotton",
      "280gsm heavyweight fabric",
      "Structured fit",
      "Reinforced collar",
      "Double-stitched seams",
      "Garment-dyed"
    ],
    reviews: { rating: 4.8, count: 178 }
  },
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getRelatedProducts = (currentId: number, category: string): Product[] => {
  return products
    .filter(p => p.id !== currentId && p.category === category)
    .slice(0, 4);
};

export const getAlsoBoughtProducts = (currentId: number): Product[] => {
  return products
    .filter(p => p.id !== currentId)
    .slice(0, 4);
};
