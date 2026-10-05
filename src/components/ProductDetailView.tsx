import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  ThermometerSnowflake,
  Minus,
  Plus,
  Check,
} from 'lucide-react';
import { ChocolateProduct } from '../data/chocolates';
import { ProductCard } from './ProductCard';

interface ProductDetailViewProps {
  product: ChocolateProduct;
  relatedProducts: ChocolateProduct[];
  isWishlisted: boolean;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: ChocolateProduct, quantity: number) => void;
  onBuyNow: (product: ChocolateProduct, quantity: number) => void;
  onSelectProduct: (product: ChocolateProduct) => void;
  onBackToShop: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  relatedProducts,
  isWishlisted,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onBackToShop,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const unitPrice = product.discountPrice ?? product.price;
  const savingsPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={onBackToShop}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#5C493E] hover:text-[#1C110C] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Chocolates</span>
        </button>

        <div className="text-xs text-[#6E5A4F] hidden sm:flex items-center gap-2">
          <span>DESHAWN Atelier</span>
          <span aria-hidden="true">/</span>
          <span>{product.category}</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#1C110C] font-medium">{product.name}</span>
        </div>
      </div>

      {/* Contiguous Purchase Module (Sticky Gallery Left + Sticky Purchase Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: Image Gallery (7 columns on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#1C110C] border border-[#1C110C]/10 shadow-lg">
            <img
              src={product.gallery[selectedImageIdx] || product.image}
              alt={`${product.name} view ${selectedImageIdx + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Selector */}
          <div className="grid grid-cols-3 gap-4">
            {product.gallery.map((imgUrl, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImageIdx(index)}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImageIdx === index
                    ? 'border-[#C59B27] shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Contiguous Purchase & Specification Module (5 columns on desktop) */}
        <div className="lg:col-span-5 bg-[#F4EFE6] rounded-2xl p-6 sm:p-8 border border-[#1C110C]/10">
          {/* Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-[#6E5A4F] mb-2">
            <span className="uppercase tracking-wider font-semibold text-[#8C6D46]">
              {product.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>Origin: {product.origin}</span>
          </div>

          <h1
            className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1C110C] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-[#6E5A4F]">{product.subtitle}</p>

          {/* Rating & Reviews Summary */}
          <div className="mt-4 flex items-center gap-3 pb-5 border-b border-[#1C110C]/10">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-[#C59B27] text-[#C59B27]"
                />
              ))}
            </div>
            <span className="font-mono-num text-sm font-semibold text-[#1C110C]">
              {product.rating.toFixed(1)}
            </span>
            <span aria-hidden="true" className="text-[#6E5A4F]">·</span>
            <a
              href="#reviews"
              className="text-sm text-[#5C493E] underline underline-offset-4 hover:text-[#1C110C]"
            >
              {product.reviewCount} Verified Tasting Reviews
            </a>
          </div>

          {/* Price & Discount */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-mono-num text-3xl font-semibold text-[#1C110C]">
              ${unitPrice.toFixed(2)}
            </span>
            {product.discountPrice && (
              <>
                <span className="font-mono-num text-lg text-[#8C7A6E] line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-[#7A5221]">
                  Save {savingsPercent}%
                </span>
              </>
            )}
          </div>

          {/* Full Description */}
          <p className="mt-4 text-sm sm:text-base text-[#3D2E26] leading-relaxed">
            {product.fullDescription}
          </p>

          {/* Key Specs Row: Cocoa %, Weight, Tasting Notes */}
          <div className="mt-6 grid grid-cols-2 gap-4 py-4 border-y border-[#1C110C]/10 text-sm">
            <div>
              <span className="block text-xs text-[#6E5A4F]">Cocoa Solids</span>
              <span className="font-mono-num font-semibold text-[#1C110C]">
                {product.cocoaPercentage}% Minimum
              </span>
            </div>
            <div>
              <span className="block text-xs text-[#6E5A4F]">Net Weight</span>
              <span className="font-mono-num font-semibold text-[#1C110C]">
                {product.weightGrams}g ({(product.weightGrams * 0.035274).toFixed(1)} oz)
              </span>
            </div>
            <div className="col-span-2">
              <span className="block text-xs text-[#6E5A4F] mb-1">Tasting Profile</span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#1C110C]">
                {product.tastingNotes.map((note, idx) => (
                  <React.Fragment key={note}>
                    <span>{note}</span>
                    {idx < product.tastingNotes.length - 1 && (
                      <span aria-hidden="true" className="text-[#C59B27]">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity Selector & Primary Actions */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5C493E]">
                Quantity
              </span>
              <div className="inline-flex items-center rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-[#1C110C] hover:bg-[#1C110C]/5 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-mono-num text-sm font-semibold text-[#1C110C]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 text-[#1C110C] hover:bg-[#1C110C]/5 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="font-mono-num text-xs text-[#6E5A4F]">
                Total: ${(unitPrice * quantity).toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCartClick}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer whitespace-nowrap ${
                  addedFeedback
                    ? 'bg-[#2E5A36] text-white'
                    : 'bg-[#1C110C] text-[#FBF9F5] hover:bg-[#332018]'
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onBuyNow(product, quantity)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C59B27] hover:bg-[#b38b1f] text-[#120A07] font-semibold text-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className="inline-flex items-center justify-center px-4 py-3.5 rounded-xl border border-[#1C110C]/20 bg-[#FBF9F5] hover:bg-[#1C110C]/5 transition-colors cursor-pointer"
                aria-label="Toggle Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? 'fill-[#C59B27] text-[#C59B27]' : 'text-[#1C110C]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mt-6 space-y-2.5 pt-5 border-t border-[#1C110C]/10 text-xs text-[#5C493E]">
            <div className="flex items-center gap-2.5">
              <ThermometerSnowflake className="w-4 h-4 text-[#8C6D46] shrink-0" />
              <span>{product.deliveryEstimate}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#8C6D46] shrink-0" />
              <span>Complimentary chilled shipping on orders above $50.00</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#8C6D46] shrink-0" />
              <span>100% Melt-Free Arrival Guarantee · Secure UPI, Card & COD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients & Nutrition Information Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-[#1C110C]/10">
        {/* Ingredients & Provenance */}
        <div className="bg-[#F4EFE6] rounded-2xl p-6 sm:p-8 border border-[#1C110C]/8">
          <h2 className="font-serif-display text-2xl font-semibold text-[#1C110C] mb-4">
            Ingredients & Craftsmanship
          </h2>
          <p className="text-sm text-[#3D2E26] leading-relaxed mb-4">
            Every DESHAWN creation is formulated without palm oil, artificial vanilla flavoring, or soy lecithin. We rely solely on pure single-origin cocoa butter and extended 72-hour conching for fluidity.
          </p>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-semibold text-[#1C110C]">Ingredients: </span>
              <span className="text-[#5C493E]">{product.ingredients.join(', ')}.</span>
            </div>
            <div>
              <span className="font-semibold text-[#1C110C]">Allergen Statement: </span>
              <span className="text-[#5C493E]">{product.allergens}</span>
            </div>
            <div>
              <span className="font-semibold text-[#1C110C]">Storage Advice: </span>
              <span className="text-[#5C493E]">
                Store in a cool, dry place between 16°C and 18°C (60°F–65°F) away from direct sunlight.
              </span>
            </div>
          </div>
        </div>

        {/* Nutrition Facts Table with Tabular Numerals */}
        <div className="bg-[#F4EFE6] rounded-2xl p-6 sm:p-8 border border-[#1C110C]/8">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
              Nutrition Information
            </h2>
            <span className="text-xs text-[#6E5A4F] font-mono-num">
              Serving Size: {product.nutrition.servingSize}
            </span>
          </div>

          <div className="divide-y divide-[#1C110C]/10 text-sm">
            <div className="py-2.5 flex justify-between">
              <span className="font-semibold text-[#1C110C]">Calories</span>
              <span className="font-mono-num font-semibold text-[#1C110C]">
                {product.nutrition.calories} kcal
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#3D2E26]">Total Fat</span>
              <span className="font-mono-num text-[#1C110C]">{product.nutrition.totalFat}</span>
            </div>
            <div className="py-2.5 flex justify-between pl-4 text-xs">
              <span className="text-[#5C493E]">Saturated Fat</span>
              <span className="font-mono-num text-[#1C110C]">
                {product.nutrition.saturatedFat}
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#3D2E26]">Total Carbohydrates</span>
              <span className="font-mono-num text-[#1C110C]">
                {product.nutrition.carbohydrates}
              </span>
            </div>
            <div className="py-2.5 flex justify-between pl-4 text-xs">
              <span className="text-[#5C493E]">Total Sugars</span>
              <span className="font-mono-num text-[#1C110C]">{product.nutrition.sugars}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#3D2E26]">Protein</span>
              <span className="font-mono-num text-[#1C110C]">{product.nutrition.protein}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div id="reviews" className="mt-16 pt-12 border-t border-[#1C110C]/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8C6D46] font-semibold">
              Verified Patron Impressions
            </p>
            <h2 className="font-serif-display text-3xl font-semibold text-[#1C110C] mt-1">
              Customer Reviews ({product.reviewCount})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-4 h-4 fill-[#C59B27] text-[#C59B27]" />
              ))}
            </div>
            <span className="font-mono-num text-lg font-semibold text-[#1C110C]">
              {product.rating.toFixed(1)} out of 5.0
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-xl bg-[#F4EFE6] p-6 border border-[#1C110C]/8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#6E5A4F] mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]" />
                    ))}
                  </div>
                  <span>{rev.date}</span>
                </div>
                <h3 className="font-serif-display text-xl font-semibold text-[#1C110C] mb-2">
                  “{rev.title}”
                </h3>
                <p className="text-sm text-[#3D2E26] leading-relaxed">{rev.comment}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#1C110C]/8 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#1C110C]">{rev.author}</span>
                  <span aria-hidden="true" className="mx-1.5 text-[#6E5A4F]">·</span>
                  <span className="text-[#5C493E]">{rev.role}</span>
                </div>
                <span className="text-[#2E5A36] font-medium">Verified Buyer · {rev.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16 pt-12 border-t border-[#1C110C]/10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#8C6D46] font-semibold">
            Complementary Pairings
          </p>
          <h2 className="font-serif-display text-3xl font-semibold text-[#1C110C] mt-1">
            Related Chocolates
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {relatedProducts.slice(0, 3).map((rel) => (
            <ProductCard
              key={rel.id}
              product={rel}
              isWishlisted={wishlistIds.includes(rel.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
