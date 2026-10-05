/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowRight,
  Star,
  Play,
  SlidersHorizontal,
  Check,
  Gift,
  Package,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import {
  PRODUCTS,
  IMAGES,
  ChocolateProduct,
  ProductCategory,
  CartItem,
  OrderRecord,
} from './data/chocolates';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import {
  CartView,
  CheckoutView,
  OrderConfirmationAndTracker,
} from './components/CartAndCheckout';
import { CinematicAdExperience } from './components/CinematicAdExperience';

type ActivePage =
  | 'home'
  | 'shop'
  | 'collections'
  | 'gift-boxes'
  | 'about'
  | 'contact'
  | 'product-detail'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'account';

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<ChocolateProduct>(PRODUCTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  // Shopping State
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 1 },
    { product: PRODUCTS[3], quantity: 1 },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['deshawn-piedmont-hazelnut']);
  const [promoCode, setPromoCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);

  // Newsletter & Contact State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const totalCartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Handlers
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToCart = (product: ChocolateProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleBuyNow = (product: ChocolateProduct, quantity = 1) => {
    handleAddToCart(product, quantity);
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleApplyPromo = (code: string) => {
    if (code.toUpperCase() === 'DESHAWN15' || code.toUpperCase() === 'TASTE15') {
      setPromoCode(code.toUpperCase());
      setDiscountRate(0.15);
      return true;
    }
    setDiscountRate(0);
    return false;
  };

  const handleSelectProduct = (product: ChocolateProduct) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: ActivePage, categoryFilter?: 'All' | ProductCategory) => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = (
    orderData: Omit<OrderRecord, 'orderId' | 'placedAt' | 'statusStep' | 'estimatedArrival'>
  ) => {
    const newOrder: OrderRecord = {
      ...orderData,
      orderId: `DSH-${Math.floor(100000 + Math.random() * 900000)}`,
      placedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      statusStep: 1,
      estimatedArrival:
        orderData.deliveryMethod === 'chilled_express'
          ? 'Within 24–48 Hours (Chilled Air)'
          : '3–4 Business Days',
    };
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCart([]);
    setActivePage('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvanceOrderStep = () => {
    if (!activeOrder) return;
    const nextStep = Math.min(4, activeOrder.statusStep + 1) as 1 | 2 | 3 | 4;
    const updated = { ...activeOrder, statusStep: nextStep };
    setActiveOrder(updated);
    setOrders((prev) =>
      prev.map((o) => (o.orderId === updated.orderId ? updated : o))
    );
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.tastingNotes.some((n) => n.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewCount - a.reviewCount; // 'popular'
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const categories: ('All' | ProductCategory)[] = [
    'All',
    'Dark Chocolate',
    'Milk Chocolate',
    'Nuts & Praline',
    'Caramel & Sea Salt',
    'Gift Boxes',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C110C]">
      {/* 1. NAVIGATION — Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 h-16 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#1C110C]/10 px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('home', 'All');
          }}
          className="font-serif-display text-2xl sm:text-[28px] font-bold tracking-[0.18em] text-[#1C110C] whitespace-nowrap"
        >
          DESHAWN
        </a>

        {/* Zone 2: 6 Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#5C493E]">
          {[
            { id: 'home' as ActivePage, label: 'Home' },
            { id: 'shop' as ActivePage, label: 'Shop' },
            { id: 'collections' as ActivePage, label: 'Collections' },
            { id: 'gift-boxes' as ActivePage, label: 'Gift Boxes' },
            { id: 'about' as ActivePage, label: 'About Us' },
            { id: 'contact' as ActivePage, label: 'Contact' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                handleNavigate(
                  item.id,
                  item.id === 'gift-boxes' ? 'Gift Boxes' : 'All'
                )
              }
              className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                activePage === item.id
                  ? 'border-[#C59B27] text-[#1C110C] font-semibold'
                  : 'border-transparent hover:text-[#1C110C] hover:border-[#1C110C]/30'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Right Utility Actions (Search, Wishlist, Cart, Account) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (!isSearchOpen && activePage !== 'shop') {
                setActivePage('shop');
              }
            }}
            className="p-2 rounded-lg text-[#1C110C] hover:bg-[#1C110C]/5 transition-colors cursor-pointer"
            aria-label="Search chocolates"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('wishlist')}
            className="relative p-2 rounded-lg text-[#1C110C] hover:bg-[#1C110C]/5 transition-colors cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1 right-1 font-mono-num text-[10px] font-bold bg-[#C59B27] text-[#120A07] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('cart')}
            className="relative p-2 rounded-lg text-[#1C110C] hover:bg-[#1C110C]/5 transition-colors cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute top-1 right-1 font-mono-num text-[10px] font-bold bg-[#1C110C] text-[#FBF9F5] w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('account')}
            className="p-2 rounded-lg text-[#1C110C] hover:bg-[#1C110C]/5 transition-colors cursor-pointer"
            aria-label="Account & Orders"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#1C110C] hover:bg-[#1C110C]/5 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Expandable Search Bar */}
      {isSearchOpen && (
        <div className="bg-[#F4EFE6] border-b border-[#1C110C]/10 px-4 sm:px-8 py-3.5">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-[#8C6D46] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'shop') setActivePage('shop');
              }}
              placeholder="Search DESHAWN by origin, cocoa %, hazelnut, caramel, or gift box..."
              autoFocus
              className="w-full bg-transparent text-sm text-[#1C110C] placeholder-[#8C7A6E] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#6E5A4F] hover:text-[#1C110C] cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-[#6E5A4F] hover:text-[#1C110C] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F4EFE6] border-b border-[#1C110C]/10 px-6 py-5 space-y-3">
          {[
            { id: 'home' as ActivePage, label: 'Home' },
            { id: 'shop' as ActivePage, label: 'Shop All Chocolates' },
            { id: 'collections' as ActivePage, label: 'Collections' },
            { id: 'gift-boxes' as ActivePage, label: 'Luxury Gift Boxes' },
            { id: 'about' as ActivePage, label: 'About DESHAWN' },
            { id: 'contact' as ActivePage, label: 'Contact Concierge' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                handleNavigate(
                  item.id,
                  item.id === 'gift-boxes' ? 'Gift Boxes' : 'All'
                )
              }
              className="block w-full text-left py-2 text-base font-medium text-[#1C110C] border-b border-[#1C110C]/5 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* MAIN VIEW ROUTER */}
      <main className="flex-1">
        {/* ==================== HOMEPAGE ==================== */}
        {activePage === 'home' && (
          <div>
            {/* 2. HERO SECTION */}
            <section className="relative overflow-hidden bg-[#120A07] text-[#FBF9F5]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                {/* Left Column: Editorial Typography & CTAs */}
                <div className="lg:col-span-6 space-y-6 z-10">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59B27] font-semibold">
                    <span>Single-Origin Couverture</span>
                    <span aria-hidden="true">·</span>
                    <span>Handcrafted Daily</span>
                  </div>

                  <h1
                    className="font-serif-display text-4xl sm:text-6xl lg:text-[64px] font-semibold text-[#FBF9F5] leading-[1.06] tracking-tight"
                    style={{ textWrap: 'balance' }}
                  >
                    Indulge in Something Extraordinary.
                  </h1>

                  <p className="text-base sm:text-lg text-[#E5DEC9]/90 leading-relaxed max-w-xl">
                    Crafted with rich cocoa, premium ingredients, and passion in every bite.
                  </p>

                  {/* Primary & Secondary CTAs */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleNavigate('shop', 'All')}
                      className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#C59B27] hover:bg-[#b38b1f] text-[#120A07] font-semibold text-sm transition-all cursor-pointer whitespace-nowrap shadow-lg"
                    >
                      <span>Shop Chocolates</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate('collections')}
                      className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#FBF9F5]/10 hover:bg-[#FBF9F5]/15 text-[#FBF9F5] border border-[#FBF9F5]/20 font-semibold text-sm transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>Explore Our Collection</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAdModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-[#E6D5B8] hover:text-[#C59B27] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span className="w-8 h-8 rounded-full bg-[#C59B27]/20 border border-[#C59B27] flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27] ml-0.5" />
                      </span>
                      <span>Watch Brand Film</span>
                    </button>
                  </div>

                  {/* Quantitative Craft Metrics (Unboxed) */}
                  <div className="pt-6 border-t border-[#FBF9F5]/15 grid grid-cols-3 gap-6 text-xs text-[#E5DEC9]/80">
                    <div>
                      <span className="block font-mono-num text-xl font-semibold text-[#C59B27]">
                        72 Hrs
                      </span>
                      <span>Granite Mill Conching</span>
                    </div>
                    <div>
                      <span className="block font-mono-num text-xl font-semibold text-[#C59B27]">
                        100%
                      </span>
                      <span>Single-Estate Cocoa Butter</span>
                    </div>
                    <div>
                      <span className="block font-mono-num text-xl font-semibold text-[#C59B27]">
                        4.9 / 5
                      </span>
                      <span>From 1,020+ Connoisseurs</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Luxury Studio Photography */}
                <div className="lg:col-span-6 relative">
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-[#C59B27]/30 shadow-2xl bg-[#1C110C]">
                    <img
                      src={IMAGES.hero}
                      alt="DESHAWN luxury chocolate bars and broken pieces on a studio surface"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120A07]/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-[#FBF9F5]/90">
                      <span className="font-serif-display italic text-base text-[#E6D5B8]">
                        Signature Noir 85% & Gianduja Reserve
                      </span>
                      <span className="font-mono-num text-[#C59B27]">
                        Batch No. 042 · Freshly Tempered
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. FEATURED CHOCOLATES & 4. BEST SELLERS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8C6D46] font-semibold">
                    01. Curated Tasting Gallery
                  </p>
                  <h2
                    className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#1C110C] mt-1"
                    style={{ textWrap: 'balance' }}
                  >
                    Featured Chocolates & Best Sellers
                  </h2>
                </div>

                {/* Interactive Category Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F4EFE6] border border-[#1C110C]/10">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-[#1C110C] text-[#FBF9F5] shadow-sm'
                          : 'text-[#5C493E] hover:text-[#1C110C]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onSelectProduct={handleSelectProduct}
                  />
                ))}
              </div>
            </section>

            {/* CINEMATIC ADVERTISING EXPERIENCE SECTION */}
            <section className="bg-[#160D09] text-[#FBF9F5] py-16 sm:py-24 border-y border-[#C59B27]/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#C59B27] font-semibold">
                      02. The DESHAWN Cinema Commercial
                    </p>
                    <h2
                      className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#FBF9F5] mt-1"
                      style={{ textWrap: 'balance' }}
                    >
                      DESHAWN — Taste the Extraordinary.
                    </h2>
                  </div>
                  <p className="text-sm text-[#E5DEC9]/80 max-w-md">
                    Experience our six-scene interactive commercial—from the gold-embossed monolith wrapper to the slow-motion macro snap and lifestyle tasting.
                  </p>
                </div>

                <CinematicAdExperience
                  isOpen={true}
                  inlineMode={true}
                  onClose={() => {}}
                  onShopNow={() => handleNavigate('shop', 'All')}
                />
              </div>
            </section>

            {/* 5. WHY DESHAWN */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="max-w-2xl mb-12">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8C6D46] font-semibold">
                  03. The House Standard
                </p>
                <h2
                  className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#1C110C] mt-1"
                  style={{ textWrap: 'balance' }}
                >
                  Why Discerning Palates Choose DESHAWN
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    num: '01',
                    title: 'Premium Single-Estate Cocoa',
                    desc: 'Sourced directly from ethical partner estates in Ecuador, Venezuela, and Madagascar—representing the top 2% of fine flavor cacao harvests.',
                  },
                  {
                    num: '02',
                    title: 'Carefully Selected Ingredients',
                    desc: 'Whole IGP Piedmont hazelnuts, Spanish Marcona almonds, Normandy cultured butter, and real Tahitian vanilla pods—never palm oil or artificial flavors.',
                  },
                  {
                    num: '03',
                    title: 'Freshly Crafted in Small Batches',
                    desc: 'Conched for up to 72 hours and tempered daily in our climate-controlled atelier so every bar arrives at peak aromatic complexity.',
                  },
                  {
                    num: '04',
                    title: 'Heirloom Gold-Foil Packaging',
                    desc: 'Hermetically sealed in gold foil and heavy matte cocoa stock embossed with the DESHAWN crest to lock in freshness and elevate gifting.',
                  },
                  {
                    num: '05',
                    title: 'Chilled Fast Delivery',
                    desc: 'Dispatched in insulated thermal liners with phase-change cold packs, guaranteeing zero melt from our temper table to your door.',
                  },
                  {
                    num: '06',
                    title: 'Trusted & Secure Payments',
                    desc: 'Seamless checkout supporting instant UPI, major Credit & Debit Cards, Net Banking, and verified Cash on Delivery.',
                  },
                ].map((pillar) => (
                  <div
                    key={pillar.num}
                    className="p-7 rounded-2xl bg-[#F4EFE6] border border-[#1C110C]/8 flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-mono-num text-xs font-semibold text-[#8C6D46]">
                        {pillar.num}.
                      </span>
                      <h3 className="font-serif-display text-2xl font-semibold text-[#1C110C] mt-2">
                        {pillar.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-[#5C493E] leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. CHOCOLATE COLLECTIONS & 9. PREMIUM GIFT BOXES & 7. SPECIAL OFFERS */}
            <section className="bg-[#F4EFE6] py-16 sm:py-24 border-y border-[#1C110C]/8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* Collections Grid */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#8C6D46] font-semibold">
                        04. Signature Worlds
                      </p>
                      <h2 className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#1C110C] mt-1">
                        Explore Chocolate Collections
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNavigate('shop', 'All')}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C110C] hover:text-[#7A5221] cursor-pointer"
                    >
                      <span>View Complete Catalog</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Grand Cru Dark Collection',
                        subtitle: '70% to 85% Single-Origin Couverture',
                        image: IMAGES.dark,
                        category: 'Dark Chocolate' as ProductCategory,
                      },
                      {
                        title: 'Roasted Nut & Gianduja Reserve',
                        subtitle: 'Piedmont Hazelnuts & Marcona Almonds',
                        image: IMAGES.hazelnut,
                        category: 'Nuts & Praline' as ProductCategory,
                      },
                      {
                        title: 'Velvet Milk & Salted Caramel',
                        subtitle: 'Alpine Cream & Guérande Sea Salt',
                        image: IMAGES.caramel,
                        category: 'Caramel & Sea Salt' as ProductCategory,
                      },
                    ].map((col) => (
                      <div
                        key={col.title}
                        onClick={() => handleNavigate('shop', col.category)}
                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#120A07] cursor-pointer shadow-md"
                      >
                        <img
                          src={col.image}
                          alt={col.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#120A07]/90 via-[#120A07]/35 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6 text-[#FBF9F5]">
                          <p className="text-xs text-[#E6D5B8]">{col.subtitle}</p>
                          <h3 className="font-serif-display text-2xl font-semibold mt-1 flex items-center justify-between">
                            <span>{col.title}</span>
                            <ArrowRight className="w-4 h-4 text-[#C59B27] transition-transform group-hover:translate-x-1" />
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium Gift Boxes & Special Offer Spotlight */}
                <div className="rounded-2xl bg-[#1C110C] text-[#FBF9F5] overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[#C59B27]/30">
                  <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C59B27] font-semibold">
                      <Gift className="w-4 h-4" />
                      <span>Special Connoisseur Privilege · Save 15%</span>
                    </div>
                    <h3
                      className="font-serif-display text-3xl sm:text-4xl font-semibold leading-tight"
                      style={{ textWrap: 'balance' }}
                    >
                      Le Grand Coffret — 24 Piece Luxury Gift Box
                    </h3>
                    <p className="text-sm sm:text-base text-[#E5DEC9]/85 leading-relaxed">
                      Presented in an heirloom espresso-and-gold keepsake box with complimentary satin ribbon and personalized tasting card. Enter privilege code{' '}
                      <span className="font-mono-num font-semibold text-[#C59B27]">DESHAWN15</span> at checkout for 15% off your entire order plus complimentary chilled express shipping over $50.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(PRODUCTS[5])}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C59B27] hover:bg-[#b38b1f] text-[#120A07] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>Explore Gift Coffret · $58.00</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleApplyPromo('DESHAWN15');
                          handleAddToCart(PRODUCTS[5], 1);
                          handleNavigate('cart');
                        }}
                        className="px-5 py-3.5 rounded-xl border border-[#FBF9F5]/25 hover:bg-[#FBF9F5]/10 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Apply DESHAWN15 & Add to Bag
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6 relative min-h-[300px]">
                    <img
                      src={IMAGES.giftBox}
                      alt="DESHAWN Le Grand Coffret 24 piece luxury chocolate gift box"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 8. CUSTOMER REVIEWS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8C6D46] font-semibold">
                    05. Patron Testimonials
                  </p>
                  <h2 className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#1C110C] mt-1">
                    Acclaimed by Chefs & Collectors
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C59B27] text-[#C59B27]" />
                    ))}
                  </div>
                  <span className="font-mono-num font-semibold text-[#1C110C]">4.9 / 5.0</span>
                  <span className="text-[#6E5A4F]">Average Verified Score</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    quote:
                      'We switched our tasting room mignardises to DESHAWN Noir 85%. The snap is razor-sharp and the finish has zero astringency—pure floral Arriba cacao.',
                    author: 'Elena Rostova',
                    role: 'Executive Pastry Chef, Atelier Lumière',
                    product: 'Noir 85% Single-Origin Dark',
                  },
                  {
                    quote:
                      'Sent 15 Grand Coffret gift boxes to our executive partners across New York and Chicago. Every box arrived chilled with the gold leaf truffles in pristine condition.',
                    author: 'Victoria Kensington',
                    role: 'Managing Partner, Kensington Advisory',
                    product: 'Le Grand Coffret 24-Piece Box',
                  },
                  {
                    quote:
                      'The Piedmont Hazelnut Gianduja is extraordinary. Whole crunchy roasted Italian hazelnuts in every single square, and the gold foil keeps the aroma vibrant.',
                    author: 'Julian Sterling',
                    role: 'Hospitality Director, Vance Group',
                    product: 'Gianduja Piedmont Hazelnut',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#F4EFE6] p-7 border border-[#1C110C]/8 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]" />
                        ))}
                      </div>
                      <p className="text-sm sm:text-base text-[#1C110C] leading-relaxed italic font-serif-display text-lg">
                        “{item.quote}”
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#1C110C]/10 text-xs">
                      <p className="font-semibold text-[#1C110C]">{item.author}</p>
                      <p className="text-[#5C493E] mt-0.5">{item.role}</p>
                      <p className="text-[#8C6D46] mt-1 font-medium">Purchased: {item.product}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 10. NEWSLETTER */}
            <section className="bg-[#1C110C] text-[#FBF9F5] py-16 border-t border-[#C59B27]/20">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#C59B27] font-semibold">
                  The Private Tasting List
                </p>
                <h2
                  className="font-serif-display text-3xl sm:text-4xl font-semibold"
                  style={{ textWrap: 'balance' }}
                >
                  Receive First Access to Micro-Batch Harvests
                </h2>
                <p className="text-sm text-[#E5DEC9]/80 max-w-lg mx-auto">
                  Join our chocolatier’s dispatch for seasonal single-estate releases, private pairing notes, and a 15% privilege invitation on your first order.
                </p>

                {newsletterSubscribed ? (
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2E5A36]/30 border border-[#2E5A36] text-sm text-[#FBF9F5]">
                    <Check className="w-4 h-4 text-[#C59B27]" />
                    <span>Welcome to DESHAWN. Use code DESHAWN15 at checkout for 15% off.</span>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newsletterEmail.trim()) setNewsletterSubscribed(true);
                    }}
                    className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2"
                  >
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 rounded-xl bg-[#FBF9F5]/10 border border-[#FBF9F5]/20 px-4 py-3 text-sm text-[#FBF9F5] placeholder-[#A3968C] focus:outline-none focus:border-[#C59B27]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#C59B27] hover:bg-[#b38b1f] text-[#120A07] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Join the List
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ==================== SHOP / COLLECTIONS / GIFT BOXES VIEW ==================== */}
        {(activePage === 'shop' ||
          activePage === 'collections' ||
          activePage === 'gift-boxes') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#1C110C]/10 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8C6D46] font-semibold">
                  DESHAWN Confectionery Catalog
                </p>
                <h1 className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#1C110C] mt-1">
                  {activePage === 'gift-boxes'
                    ? 'Luxury Chocolate Gift Boxes'
                    : activePage === 'collections'
                    ? 'Curated Chocolate Collections'
                    : 'Shop All Handcrafted Chocolates'}
                </h1>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#8C6D46] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bars, notes..."
                    className="pl-9 pr-4 py-2 rounded-xl bg-[#F4EFE6] border border-[#1C110C]/15 text-xs sm:text-sm text-[#1C110C] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div className="flex items-center gap-2 bg-[#F4EFE6] border border-[#1C110C]/15 rounded-xl px-3 py-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C6D46]" />
                  <label htmlFor="sort-select" className="text-xs text-[#6E5A4F]">
                    Sort:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent text-xs font-semibold text-[#1C110C] focus:outline-none cursor-pointer"
                  >
                    <option value="popular">Popularity</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F4EFE6] border border-[#1C110C]/10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#1C110C] text-[#FBF9F5] shadow-sm'
                        : 'text-[#5C493E] hover:text-[#1C110C]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <span className="text-xs text-[#6E5A4F] font-mono-num">
                Showing {filteredProducts.length} of {PRODUCTS.length} creations
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-[#F4EFE6] border border-[#1C110C]/8 p-8">
                <h3 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
                  No Chocolates Match Your Filter
                </h3>
                <p className="mt-2 text-sm text-[#5C493E]">
                  Try clearing your search query or selecting “All” categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#1C110C] text-[#FBF9F5] text-xs font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onSelectProduct={handleSelectProduct}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== PRODUCT DETAILS PAGE ==================== */}
        {activePage === 'product-detail' && (
          <ProductDetailView
            product={selectedProduct}
            relatedProducts={PRODUCTS.filter((p) => p.id !== selectedProduct.id)}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectProduct={handleSelectProduct}
            onBackToShop={() => handleNavigate('shop')}
          />
        )}

        {/* ==================== WISHLIST PAGE ==================== */}
        {activePage === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8C6D46] font-semibold">
                Saved Indulgences
              </p>
              <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1C110C] mt-1">
                Your Wishlist ({wishlistIds.length})
              </h1>
            </div>

            {wishlistIds.length === 0 ? (
              <div className="rounded-2xl bg-[#F4EFE6] p-12 text-center border border-[#1C110C]/8 max-w-xl mx-auto">
                <Heart className="w-8 h-8 text-[#8C6D46] mx-auto mb-3" />
                <h2 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
                  Your Wishlist is Empty
                </h2>
                <p className="mt-2 text-sm text-[#5C493E]">
                  Tap the heart icon on any DESHAWN chocolate bar or gift box to curate your personal tasting list.
                </p>
                <button
                  type="button"
                  onClick={() => handleNavigate('shop', 'All')}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1C110C] text-[#FBF9F5] text-xs font-semibold cursor-pointer"
                >
                  <span>Explore Chocolates</span>
                  <ArrowRight className="w-4 h-4 text-[#C59B27]" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {PRODUCTS.filter((p) => wishlistIds.includes(p.id)).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={true}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onSelectProduct={handleSelectProduct}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== CART PAGE ==================== */}
        {activePage === 'cart' && (
          <CartView
            items={cart}
            promoCode={promoCode}
            discountRate={discountRate}
            onApplyPromo={handleApplyPromo}
            onUpdateQuantity={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onProceedToCheckout={() => handleNavigate('checkout')}
            onContinueShopping={() => handleNavigate('shop')}
          />
        )}

        {/* ==================== CHECKOUT PAGE ==================== */}
        {activePage === 'checkout' && (
          <CheckoutView
            items={cart}
            discountRate={discountRate}
            onBackToCart={() => handleNavigate('cart')}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {/* ==================== ORDER CONFIRMATION & TRACKING ==================== */}
        {activePage === 'order-tracking' && activeOrder && (
          <OrderConfirmationAndTracker
            order={activeOrder}
            onAdvanceOrderStep={handleAdvanceOrderStep}
            onContinueShopping={() => handleNavigate('shop')}
          />
        )}

        {/* ==================== ABOUT US PAGE ==================== */}
        {activePage === 'about' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8C6D46] font-semibold">
                  The House of DESHAWN
                </p>
                <h1
                  className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#1C110C] leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Crafted Where Bean-to-Bar Science Meets High Confectionery.
                </h1>
                <p className="text-sm sm:text-base text-[#3D2E26] leading-relaxed">
                  Founded with a singular obsession—to restore chocolate to its rightful stature alongside grand cru wines and specialty espresso—DESHAWN roasts, conches, and tempers every bar in small numbered batches.
                </p>
                <p className="text-sm sm:text-base text-[#3D2E26] leading-relaxed">
                  We partner directly with cacao cooperatives in Ecuador, Venezuela, and Madagascar, paying well above fair-trade premiums for rare heirloom Criollo and Arriba Nacional harvests.
                </p>
                <div className="pt-2 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAdModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1C110C] text-[#FBF9F5] text-xs font-semibold cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Watch Commercial Film</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('shop', 'All')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#1C110C]/20 text-xs font-semibold cursor-pointer"
                  >
                    <span>Browse Chocolates</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <img
                  src={IMAGES.lifestyle}
                  alt="Savoring DESHAWN luxury chocolate"
                  referrerPolicy="no-referrer"
                  className="rounded-2xl shadow-xl w-full object-cover aspect-[16/10]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== CONTACT PAGE ==================== */}
        {activePage === 'contact' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-5 space-y-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8C6D46] font-semibold">
                  Client Concierge
                </p>
                <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1C110C]">
                  Bespoke Gifting & Inquiries
                </h1>
                <p className="text-sm text-[#5C493E] leading-relaxed">
                  Whether arranging corporate gift coffrets, wedding tasting favors, or inquiring about an active chilled shipment, our concierge responds within 2 hours.
                </p>
                <div className="space-y-3 pt-2 text-sm text-[#3D2E26]">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#8C6D46]" />
                    <span>concierge@deshawnchocolates.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#8C6D46]" />
                    <span className="font-mono-num">+1 (800) 555-0194</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#8C6D46]" />
                    <span>480 Mercer Street, SoHo, New York, NY</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 rounded-2xl bg-[#F4EFE6] p-6 sm:p-8 border border-[#1C110C]/10">
                {contactSubmitted ? (
                  <div className="py-10 text-center space-y-3">
                    <Check className="w-8 h-8 text-[#2E5A36] mx-auto" />
                    <h3 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
                      Message Received
                    </h3>
                    <p className="text-sm text-[#5C493E]">
                      Our Maître Chocolatier concierge desk has received your inquiry and will reply shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setContactSubmitted(false)}
                      className="mt-4 px-4 py-2 rounded-lg bg-[#1C110C] text-[#FBF9F5] text-xs font-semibold cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Evelyn Laurent"
                        className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="evelyn@example.com"
                        className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1">
                        Inquiry Topic
                      </label>
                      <select className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm">
                        <option>Corporate & Bespoke Gift Boxes</option>
                        <option>Order Status & Chilled Delivery</option>
                        <option>Allergen & Provenance Questions</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1">
                        Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="How may our atelier assist you?"
                        className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#1C110C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#332018] transition-colors cursor-pointer"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== ACCOUNT & ORDER HISTORY PAGE ==================== */}
        {activePage === 'account' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1C110C]/10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8C6D46] font-semibold">
                  DESHAWN Private Client
                </p>
                <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1C110C] mt-1">
                  Account & Order Tracking
                </h1>
              </div>
              <button
                type="button"
                onClick={() => handleNavigate('shop')}
                className="px-5 py-2.5 rounded-xl bg-[#1C110C] text-[#FBF9F5] text-xs font-semibold cursor-pointer"
              >
                New Tasting Order
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-2xl bg-[#F4EFE6] p-10 text-center border border-[#1C110C]/8">
                <Package className="w-8 h-8 text-[#8C6D46] mx-auto mb-3" />
                <h2 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
                  No Recent Orders Yet
                </h2>
                <p className="mt-2 text-sm text-[#5C493E] max-w-md mx-auto">
                  Place an order through our checkout to view live temperature-controlled shipment milestones and receipts here.
                </p>
                <button
                  type="button"
                  onClick={() => handleNavigate('shop')}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C59B27] text-[#120A07] text-xs font-semibold cursor-pointer"
                >
                  <span>Shop Chocolates</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="rounded-2xl bg-[#F4EFE6] p-6 border border-[#1C110C]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#6E5A4F] font-mono-num">
                        <span className="font-semibold text-[#1C110C]">#{ord.orderId}</span>
                        <span aria-hidden="true">·</span>
                        <span>Placed {ord.placedAt}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#2E5A36] font-semibold">
                          Step {ord.statusStep} of 4
                        </span>
                      </div>
                      <h3 className="font-serif-display text-xl font-semibold text-[#1C110C] mt-1">
                        {ord.items.map((i) => `${i.product.name} (×${i.quantity})`).join(', ')}
                      </h3>
                      <p className="text-xs text-[#5C493E] mt-1">
                        Delivering to: {ord.customer.addressLine}, {ord.customer.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <span className="font-mono-num text-lg font-semibold text-[#1C110C]">
                        ${ord.total.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveOrder(ord);
                          handleNavigate('order-tracking');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1C110C] text-[#FBF9F5] text-xs font-semibold cursor-pointer whitespace-nowrap"
                      >
                        Track Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cinematic Ad Modal when triggered from Hero or About */}
      <CinematicAdExperience
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onShopNow={() => {
          setIsAdModalOpen(false);
          handleNavigate('shop', 'All');
        }}
      />

      {/* 11. FOOTER */}
      <footer className="bg-[#120A07] text-[#E5DEC9] border-t border-[#C59B27]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#FBF9F5]/10">
            <div className="md:col-span-4 space-y-3">
              <span className="font-serif-display text-2xl font-bold tracking-[0.18em] text-[#FBF9F5]">
                DESHAWN
              </span>
              <p className="text-xs text-[#A3968C] leading-relaxed max-w-xs">
                DESHAWN — Taste the Extraordinary. Artisanal single-origin chocolates, roasted Piedmont hazelnut gianduja, and luxury gift coffrets handcrafted daily.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <p className="uppercase tracking-widest text-[#C59B27] font-semibold mb-3">
                Collections
              </p>
              {categories.slice(1).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleNavigate('shop', cat)}
                  className="block text-[#A3968C] hover:text-[#FBF9F5] py-1 cursor-pointer"
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <p className="uppercase tracking-widest text-[#C59B27] font-semibold mb-3">
                Maison DESHAWN
              </p>
              <button
                type="button"
                onClick={() => handleNavigate('about')}
                className="block text-[#A3968C] hover:text-[#FBF9F5] py-1 cursor-pointer"
              >
                Our Cacao Provenance
              </button>
              <button
                type="button"
                onClick={() => setIsAdModalOpen(true)}
                className="block text-[#A3968C] hover:text-[#FBF9F5] py-1 cursor-pointer"
              >
                Watch Commercial Film
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('account')}
                className="block text-[#A3968C] hover:text-[#FBF9F5] py-1 cursor-pointer"
              >
                Track Your Order
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('contact')}
                className="block text-[#A3968C] hover:text-[#FBF9F5] py-1 cursor-pointer"
              >
                Corporate & Wedding Gifting
              </button>
            </div>

            <div className="md:col-span-2 space-y-2 text-xs text-[#A3968C]">
              <p className="uppercase tracking-widest text-[#C59B27] font-semibold mb-3">
                Atelier Guarantee
              </p>
              <p>Chilled Thermal Dispatch</p>
              <p>100% Pure Cocoa Butter</p>
              <p>UPI · Cards · NetBanking · COD</p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A3968C] gap-4">
            <p>© {new Date().getFullYear()} DESHAWN Chocolates LLC. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span aria-hidden="true">·</span>
              <span>Terms of Service</span>
              <span aria-hidden="true">·</span>
              <span>Cold-Chain Shipping Guarantee</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
