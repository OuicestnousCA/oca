interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  isOnSale?: boolean;
}

const ProductCard = ({ name, price, originalPrice, image, isOnSale }: ProductCardProps) => {
  const formatPrice = (amount: number) => {
    return `R${amount.toFixed(2).replace('.', ',')}`;
  };

  return (
    <article className="product-card cursor-pointer">
      <div className="product-image-wrapper">
        <img 
          src={image} 
          alt={name}
          className="product-image"
          loading="lazy"
        />
        {isOnSale && (
          <span className="sale-badge">Sale!</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg tracking-wide">{name}</h3>
        <div className="mt-2 flex items-center gap-2">
          {originalPrice && (
            <span className="price-original">{formatPrice(originalPrice)}</span>
          )}
          <span className={originalPrice ? "price-sale" : "font-medium"}>
            {formatPrice(price)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
