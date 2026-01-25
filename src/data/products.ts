// Product images
import hoodieBlack1 from "@/assets/products/hoodie-black-1.png";
import hoodieBlack2 from "@/assets/products/hoodie-black-2.png";
import hoodieBlack3 from "@/assets/products/hoodie-black-3.png";
import teePink1 from "@/assets/products/tee-pink-1.jpg";
import teePink2 from "@/assets/products/tee-pink-2.jpg";
import teePink3 from "@/assets/products/tee-pink-3.jpg";
import jerseyWhite1 from "@/assets/products/jersey-white-1.jpg";
import jerseyWhite2 from "@/assets/products/jersey-white-2.jpg";
import jerseyBlack1 from "@/assets/products/jersey-black-1.png";
import jerseyBlack2 from "@/assets/products/jersey-black-2.png";
import jerseyBlack3 from "@/assets/products/jersey-black-3.png";
import pufferBlue1 from "@/assets/products/puffer-blue-1.jpg";
import pufferBlue2 from "@/assets/products/puffer-blue-2.jpg";
import pufferBlue3 from "@/assets/products/puffer-blue-3.jpg";
import capPink1 from "@/assets/products/cap-pink-1.jpg";
import capPink2 from "@/assets/products/cap-pink-2.jpg";
import capPink3 from "@/assets/products/cap-pink-3.jpg";
import shortsBlack1 from "@/assets/products/shorts-black-1.jpg";
import shortsBlack2 from "@/assets/products/shorts-black-2.jpg";
import dtsTeeBlack1 from "@/assets/products/dts-tee-black-1.jpg";
import dtsTeeBlack2 from "@/assets/products/dts-tee-black-2.jpg";
import tankPink1 from "@/assets/products/tank-pink-1.jpg";
import tankPink2 from "@/assets/products/tank-pink-2.jpg";
import wnseHoodieBlue1 from "@/assets/products/wnse-hoodie-blue-1.jpg";
import wnseHoodieBlue2 from "@/assets/products/wnse-hoodie-blue-2.jpg";
import wnseHoodieBlue3 from "@/assets/products/wnse-hoodie-blue-3.jpg";
import hellaTeeBlack1 from "@/assets/products/hella-tee-black-1.jpg";
import hellaTeeBlack2 from "@/assets/products/hella-tee-black-2.jpg";
import designerHoodiePink1 from "@/assets/products/designer-hoodie-pink-1.jpg";
import designerHoodiePink2 from "@/assets/products/designer-hoodie-pink-2.jpg";
import designerHoodiePink3 from "@/assets/products/designer-hoodie-pink-3.jpg";
import hotstuffCroptopBlack1 from "@/assets/products/hotstuff-croptop-black-1.jpg";
import hotstuffCroptopBlack2 from "@/assets/products/hotstuff-croptop-black-2.jpg";
import shorts530Black1 from "@/assets/products/530-shorts-black-1.jpg";
import shorts530Black2 from "@/assets/products/530-shorts-black-2.jpg";
import shorts530Black3 from "@/assets/products/530-shorts-black-3.jpg";
import himLongSleeve1 from "@/assets/products/him-long-sleeve-1.jpg";
import himLongSleeve2 from "@/assets/products/him-long-sleeve-2.jpg";
import himLongSleeve3 from "@/assets/products/him-long-sleeve-3.jpg";
import redVTee1 from "@/assets/products/red-v-tee-1.jpg";
import redVTee2 from "@/assets/products/red-v-tee-2.jpg";

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
    id: 16,
    name: "RED V TEE",
    price: 199.99,
    image: redVTee1,
    images: [redVTee1, redVTee2],
    isOnSale: false,
    isSelling: false,
    category: "T-Shirts",
    colors: [{ name: "Red", hex: "#dc2626", image: redVTee1 }],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description:
      "Classic red tee with clean front logo detail and a comfortable everyday fit.",
    details: [
      "Short sleeve",
      "Soft cotton feel",
      "Crew neck",
      "Regular fit",
      "Machine washable",
    ],
    reviews: { rating: 4.7, count: 0 },
  },
  {
    id: 15,
    name: "HIM LONG SLEEVE",
    price: 399,
    image: himLongSleeve1,
    images: [himLongSleeve1, himLongSleeve2, himLongSleeve3],
    isOnSale: false,
    isSelling: false,
    category: "T-Shirts",
    colors: [{ name: "Black", hex: "#1a1a1a", image: himLongSleeve1 }],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description:
      "Premium long sleeve tee in black with bold front and back graphics and sleeve detailing. Built for everyday wear with a clean streetwear silhouette.",
    details: [
      "Long sleeve",
      "Graphic print front and back",
      "Sleeve graphics",
      "Ribbed cuffs",
      "Relaxed fit",
      "Machine washable",
    ],
    reviews: { rating: 4.7, count: 0 },
  },
  {
    id: 14,
    name: "530 Short",
    price: 499.99,
    image: shorts530Black1,
    images: [shorts530Black1, shorts530Black2, shorts530Black3],
    isOnSale: false,
    isSelling: true,
    category: "Bottoms",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: shorts530Black1 },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Premium athletic shorts with contrast piping and signature branding. Features elastic waistband with drawstring for the perfect fit.",
    details: [
      "100% Polyester",
      "Lightweight fabric",
      "Elastic waistband with drawstring",
      "Contrast piping detail",
      "Embroidered logo",
      "Machine washable",
    ],
    reviews: { rating: 4.7, count: 0 },
  },
  {
    id: 1,
    name: "YBY O Hoodie",
    price: 499.99,
    originalPrice: 699.99,
    image: hoodieBlack1,
    images: [hoodieBlack1, hoodieBlack2, hoodieBlack3],
    isOnSale: true,
    isSelling: true,
    category: "Hoodies",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: hoodieBlack1 },
      { name: "Charcoal", hex: "#3d3d3d", image: hoodieBlack1 },
      { name: "Navy", hex: "#1e3a5f", image: hoodieBlack1 },
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
    image: teePink1,
    images: [teePink1, teePink2, teePink3],
    isOnSale: false,
    isSelling: false,
    category: "T-Shirts",
    colors: [
      { name: "Pink", hex: "#e8a0b5", image: teePink1 },
      { name: "White", hex: "#ffffff", image: teePink1 },
      { name: "Black", hex: "#1a1a1a", image: teePink1 },
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
    image: jerseyWhite1,
    images: [jerseyWhite1, jerseyWhite2],
    isOnSale: false,
    isSelling: true,
    category: "Jerseys",
    colors: [
      { name: "White", hex: "#ffffff", image: jerseyWhite1 },
      { name: "Black", hex: "#1a1a1a", image: jerseyBlack1 },
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
    image: jerseyBlack1,
    images: [jerseyBlack1, jerseyBlack2, jerseyBlack3],
    isOnSale: false,
    isSelling: false,
    category: "Jerseys",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: jerseyBlack1 },
      { name: "White", hex: "#ffffff", image: jerseyWhite1 },
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
    image: pufferBlue1,
    images: [pufferBlue1, pufferBlue2, pufferBlue3],
    isOnSale: false,
    isSelling: false,
    category: "Outerwear",
    colors: [
      { name: "Blue", hex: "#3a6ea5", image: pufferBlue1 },
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
    image: capPink1,
    images: [capPink1, capPink2, capPink3],
    isOnSale: true,
    isSelling: false,
    category: "Accessories",
    colors: [
      { name: "Pink", hex: "#e8a0b5", image: capPink1 },
      { name: "Black", hex: "#1a1a1a", image: capPink1 },
      { name: "White", hex: "#ffffff", image: capPink1 },
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
    image: shortsBlack1,
    images: [shortsBlack1, shortsBlack2],
    isOnSale: true,
    isSelling: true,
    category: "Bottoms",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: shortsBlack1 },
      { name: "Grey", hex: "#6b6b6b", image: shortsBlack1 },
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
    image: dtsTeeBlack1,
    images: [dtsTeeBlack1, dtsTeeBlack2],
    isOnSale: false,
    isSelling: false,
    category: "T-Shirts",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: dtsTeeBlack1 },
      { name: "White", hex: "#ffffff", image: dtsTeeBlack1 },
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
  {
    id: 9,
    name: "LA Tank Top",
    price: 399.99,
    image: tankPink1,
    images: [tankPink1, tankPink2],
    isOnSale: false,
    isSelling: false,
    category: "T-Shirts",
    colors: [
      { name: "Pink", hex: "#c77dba", image: tankPink1 },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Bold statement tank top with unique graphic design. Perfect for workouts or casual streetwear style.",
    details: [
      "100% Cotton",
      "Relaxed fit",
      "Sleeveless design",
      "Graphic print front and back",
      "Soft hand feel",
      "Machine washable"
    ],
    reviews: { rating: 4.6, count: 32 }
  },
  {
    id: 10,
    name: "WNSE O Hoodie",
    price: 499.99,
    originalPrice: 799.99,
    image: wnseHoodieBlue1,
    images: [wnseHoodieBlue1, wnseHoodieBlue2, wnseHoodieBlue3],
    isOnSale: true,
    isSelling: true,
    category: "Hoodies",
    colors: [
      { name: "Blue", hex: "#2563eb", image: wnseHoodieBlue1 },
      { name: "Red", hex: "#dc2626", image: wnseHoodieBlue1 },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Premium WNSE compass hoodie with bold graphic design. Features the signature directional arrows print on the back and sleeve details.",
    details: [
      "100% Cotton",
      "Heavyweight 380gsm fabric",
      "Relaxed fit",
      "Full-zip front",
      "Kangaroo pocket",
      "Machine washable"
    ],
    reviews: { rating: 4.7, count: 58 }
  },
  {
    id: 11,
    name: "Hella O Tee",
    price: 299.99,
    image: hellaTeeBlack1,
    images: [hellaTeeBlack1, hellaTeeBlack2],
    isOnSale: false,
    isSelling: true,
    category: "T-Shirts",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: hellaTeeBlack1 },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Premium Hella graphic tee featuring the signature 'OUIGESTNOUS' print. Made from soft, breathable cotton for all-day comfort.",
    details: [
      "100% Cotton",
      "200gsm fabric weight",
      "Relaxed fit",
      "Screen-printed graphic",
      "Reinforced collar",
      "Machine washable"
    ],
    reviews: { rating: 4.6, count: 42 }
  },
  {
    id: 12,
    name: "1999 O Designer Hoodie",
    price: 499.99,
    originalPrice: 599.99,
    image: designerHoodiePink1,
    images: [designerHoodiePink1, designerHoodiePink2, designerHoodiePink3],
    isOnSale: true,
    isSelling: true,
    category: "Hoodies",
    colors: [
      { name: "Pink", hex: "#e8a0b5", image: designerHoodiePink1 },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Premium designer hoodie featuring the signature butterfly and floral graphic on the back. Crafted from soft cotton with sleeve details.",
    details: [
      "100% Cotton",
      "Heavyweight 380gsm fabric",
      "Relaxed fit",
      "Kangaroo pocket",
      "Graphic print back and sleeves",
      "Machine washable"
    ],
    reviews: { rating: 4.8, count: 76 }
  },
  {
    id: 13,
    name: "HOTSTUFF Crop Top",
    price: 299,
    image: hotstuffCroptopBlack1,
    images: [hotstuffCroptopBlack1, hotstuffCroptopBlack2],
    isOnSale: false,
    isSelling: true,
    category: "T-Shirts",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: hotstuffCroptopBlack1 },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Stylish crop top featuring the signature 'OUICESTNOUS' logo print. Perfect for casual or streetwear styling.",
    details: [
      "100% Cotton",
      "Lightweight fabric",
      "Cropped fit",
      "Screen-printed graphic",
      "Soft hand feel",
      "Machine washable"
    ],
    reviews: { rating: 4.5, count: 0 }
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
