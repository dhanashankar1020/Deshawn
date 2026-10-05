import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { ChocolateProduct } from '../data/chocolates';

interface ProductCardProps {
  product: ChocolateProduct;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: ChocolateProduct, quantity: number) => void;
  onSelectProduct: (product: ChocolateProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col rounded-xl bg-[#F4EFE6] border border-[#1C110C]/8 overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
    >
      {/* Product Image Container (4:3 Aspect Ratio) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#23150F]">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#2A1810] to-[#120A07] p-6 text-center text-[#E6D5B8]">
            <span className="font-serif-display text-xl tracking-widest uppercase text-[#C59B27]">
              DESHAWN
            </span>
            <span className="mt-1 text-xs text-[#A3968C]">{product.name}</span>
          </div>
        )}

        {/* Subtle Dark Gradient Scrim at Top for Wishlist Button Contrast */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-3.5 right-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#1C110C]/75 text-[#FBF9F5] backdrop-blur-sm transition-transform duration-150 hover:scale-105 cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? 'fill-[#C59B27] text-[#C59B27]' : 'text-[#FBF9F5]'
            }`}
          />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-t from-[#120A07]/80 to-transparent flex justify-end">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FBF9F5]">
            <Eye className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>View Tasting Notes</span>
          </span>
        </div>
      </div>

      {/* Product Details Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
          <div className="flex items-center justify-between gap-2 text-xs text-[#6E5A4F] mb-1.5">
            <div className="flex items-center gap-1.5 truncate">
              <span className="uppercase tracking-wider font-medium text-[#8C6D46]">
                {product.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">{product.cocoaPercentage}% Cacao</span>
            </div>

            <div className="flex items-center gap-1 shrink-0 text-[#1C110C]">
              <Star className="h-3.5 w-3.5 fill-[#C59B27] text-[#C59B27]" />
              <span className="font-mono-num font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-[#6E5A4F] font-mono-num">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif-display text-xl font-semibold text-[#1C110C] group-hover:text-[#7A5221] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="mt-1.5 text-sm text-[#5C493E] line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Add to Cart Row */}
        <div className="mt-5 pt-4 border-t border-[#1C110C]/8 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            {product.discountPrice ? (
              <>
                <span className="font-mono-num text-lg font-semibold text-[#1C110C]">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="font-mono-num text-xs text-[#8C7A6E] line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-mono-num text-lg font-semibold text-[#1C110C]">
                ${product.price.toFixed(2)}
              </span>
            )}
            <span className="text-xs text-[#6E5A4F] font-mono-num">/ {product.weightGrams}g</span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
              justAdded
                ? 'bg-[#2E5A36] text-white'
                : 'bg-[#1C110C] text-[#FBF9F5] hover:bg-[#332018]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5 text-[#C59B27]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
