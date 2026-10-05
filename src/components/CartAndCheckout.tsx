import React, { useState } from 'react';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  PackageCheck,
  Clock,
  MapPin,
} from 'lucide-react';
import { CartItem, OrderRecord, PaymentMethodType } from '../data/chocolates';

interface CartViewProps {
  items: CartItem[];
  promoCode: string;
  discountRate: number;
  onApplyPromo: (code: string) => boolean;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  promoCode,
  discountRate,
  onApplyPromo,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const [inputCode, setInputCode] = useState(promoCode);
  const [promoStatus, setPromoStatus] = useState<'idle' | 'applied' | 'invalid'>(
    discountRate > 0 ? 'applied' : 'idle'
  );

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity,
    0
  );
  const discountAmount = subtotal * discountRate;
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 50 ? 0 : 6.5;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onApplyPromo(inputCode.trim());
    setPromoStatus(ok ? 'applied' : 'invalid');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#F4EFE6] flex items-center justify-center mb-6 border border-[#1C110C]/10">
          <ShoppingBag className="w-7 h-7 text-[#8C6D46]" />
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1C110C]">
          Your Tasting Bag is Empty
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#5C493E] max-w-md mx-auto">
          Explore our single-origin dark bars, Piedmont hazelnut gianduja, and luxury gift coffrets handcrafted daily.
        </p>
        <button
          type="button"
          onClick={onContinueShopping}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1C110C] text-[#FBF9F5] hover:bg-[#332018] text-sm font-semibold transition-colors cursor-pointer"
        >
          <span>Shop Chocolates</span>
          <ArrowRight className="w-4 h-4 text-[#C59B27]" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8C6D46] font-semibold">
            DESHAWN Online Boutique
          </p>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1C110C] mt-1">
            Your Shopping Bag
          </h1>
        </div>
        <button
          type="button"
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#5C493E] hover:text-[#1C110C] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product, quantity }) => {
            const unitPrice = product.discountPrice ?? product.price;
            return (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F4EFE6] border border-[#1C110C]/8"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-24 h-20 rounded-xl object-cover bg-[#1C110C] shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#6E5A4F]">
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{product.weightGrams}g</span>
                    </div>
                    <h3 className="font-serif-display text-xl font-semibold text-[#1C110C]">
                      {product.name}
                    </h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-mono-num text-sm font-semibold text-[#1C110C]">
                        ${unitPrice.toFixed(2)} each
                      </span>
                      {product.discountPrice && (
                        <span className="font-mono-num text-xs text-[#8C7A6E] line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity & Subtotal Controls */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1C110C]/8">
                  <div className="inline-flex items-center rounded-lg border border-[#1C110C]/15 bg-[#FBF9F5]">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                      className="p-2 text-[#1C110C] hover:bg-[#1C110C]/5 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 font-mono-num text-sm font-semibold text-[#1C110C]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                      className="p-2 text-[#1C110C] hover:bg-[#1C110C]/5 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-mono-num text-base font-semibold text-[#1C110C] min-w-[72px] text-right">
                    ${(unitPrice * quantity).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(product.id)}
                    className="p-2 text-[#8C7A6E] hover:text-[#9E2A2B] transition-colors cursor-pointer"
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 rounded-2xl bg-[#F4EFE6] p-6 sm:p-8 border border-[#1C110C]/10 space-y-6">
          <h2 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
            Order Summary
          </h2>

          {/* Promo Code Input */}
          <form onSubmit={handlePromoSubmit} className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-[#5C493E] font-semibold">
              Privilege Code (Try: DESHAWN15)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-3.5 py-2 text-sm text-[#1C110C] focus:outline-none focus:border-[#C59B27]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#1C110C] text-[#FBF9F5] text-xs font-semibold hover:bg-[#332018] transition-colors cursor-pointer whitespace-nowrap"
              >
                Apply
              </button>
            </div>
            {promoStatus === 'applied' && (
              <p className="text-xs text-[#2E5A36] font-medium">
                15% Connoisseur privilege discount applied.
              </p>
            )}
            {promoStatus === 'invalid' && (
              <p className="text-xs text-[#9E2A2B] font-medium">
                Invalid code. Use DESHAWN15 for 15% off.
              </p>
            )}
          </form>

          {/* Breakdown with Tabular Numerals */}
          <div className="space-y-3 pt-4 border-t border-[#1C110C]/10 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5C493E]">Subtotal</span>
              <span className="font-mono-num font-medium text-[#1C110C]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5C493E]">Insulated Chilled Delivery</span>
              <span className="font-mono-num font-medium text-[#1C110C]">
                {deliveryFee === 0 ? 'Complimentary' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#2E5A36]">
                <span>Privilege Discount (15%)</span>
                <span className="font-mono-num font-medium">
                  -${discountAmount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="pt-3 border-t border-[#1C110C]/15 flex justify-between items-baseline">
              <span className="font-semibold text-[#1C110C]">Final Total</span>
              <span className="font-mono-num text-2xl font-semibold text-[#1C110C]">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {subtotal < 50 && (
            <p className="text-xs text-[#7A5221] bg-[#C59B27]/15 px-3.5 py-2.5 rounded-lg">
              Add <span className="font-mono-num font-semibold">${(50 - subtotal).toFixed(2)}</span> more for complimentary chilled express shipping.
            </p>
          )}

          <button
            type="button"
            onClick={onProceedToCheckout}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#C59B27] hover:bg-[#b38b1f] text-[#120A07] font-semibold text-sm transition-all cursor-pointer whitespace-nowrap shadow-md"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-[#6E5A4F]">
            <ShieldCheck className="w-4 h-4 text-[#8C6D46]" />
            <span>256-Bit Encrypted Checkout · UPI, Card, NetBanking & COD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CheckoutViewProps {
  items: CartItem[];
  discountRate: number;
  onBackToCart: () => void;
  onPlaceOrder: (orderData: Omit<OrderRecord, 'orderId' | 'placedAt' | 'statusStep' | 'estimatedArrival'>) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  discountRate,
  onBackToCart,
  onPlaceOrder,
}) => {
  const [fullName, setFullName] = useState('Aria Montgomery');
  const [email, setEmail] = useState('aria.montgomery@example.com');
  const [phone, setPhone] = useState('+1 (555) 234-8910');
  const [addressLine, setAddressLine] = useState('742 Madison Avenue, Suite 14B');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [postalCode, setPostalCode] = useState('10065');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'chilled_express'>('chilled_express');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('UPI');
  const [upiId, setUpiId] = useState('aria@okicici');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8891');
  const [bankName, setBankName] = useState('HDFC / Chase Private Client');
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity,
    0
  );
  const discountAmount = subtotal * discountRate;
  const baseShipping = subtotal >= 50 ? 0 : 6.5;
  const deliveryCharge = deliveryMethod === 'chilled_express' ? baseShipping : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryCharge);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !addressLine.trim() || !city.trim() || !postalCode.trim()) {
      setErrorMsg('Please complete all required delivery address and contact fields.');
      return;
    }
    setErrorMsg('');
    onPlaceOrder({
      customer: {
        fullName,
        email,
        phone,
        addressLine,
        city,
        state,
        postalCode,
      },
      deliveryMethod,
      paymentMethod,
      items,
      subtotal,
      discountAmount,
      deliveryCharge,
      total,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <button
        type="button"
        onClick={onBackToCart}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#5C493E] hover:text-[#1C110C] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping Bag</span>
      </button>

      <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1C110C] mb-8">
        Secure Atelier Checkout
      </h1>

      {errorMsg && (
        <div className="mb-6 rounded-xl bg-[#9E2A2B]/10 border border-[#9E2A2B] p-4 text-sm text-[#9E2A2B]">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact Information */}
          <section className="rounded-2xl bg-[#F4EFE6] p-6 sm:p-8 border border-[#1C110C]/8 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
              01. Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C110C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C110C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1.5">
                  Phone Number (For Delivery Updates) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C110C]"
                />
              </div>
            </div>
          </section>

          {/* 2. Delivery Address */}
          <section className="rounded-2xl bg-[#F4EFE6] p-6 sm:p-8 border border-[#1C110C]/8 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
              02. Delivery Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1.5">
                  Street Address & Apartment/Suite *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C110C]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C110C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1.5">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C110C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1.5">
                    Postal / ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C110C] font-mono-num"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. Delivery Method */}
          <section className="rounded-2xl bg-[#F4EFE6] p-6 sm:p-8 border border-[#1C110C]/8 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
              03. Temperature-Controlled Delivery Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryMethod('chilled_express')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryMethod === 'chilled_express'
                    ? 'border-[#C59B27] bg-[#FBF9F5] shadow-sm'
                    : 'border-[#1C110C]/15 bg-transparent'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-sm text-[#1C110C]">
                  <span>Chilled Express Air (1–2 Days)</span>
                  <span className="font-mono-num">
                    {subtotal >= 50 ? 'FREE' : '$6.50'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#5C493E]">
                  Packed with reusable phase-change ice packs inside insulated thermal liners.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('standard')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryMethod === 'standard'
                    ? 'border-[#C59B27] bg-[#FBF9F5] shadow-sm'
                    : 'border-[#1C110C]/15 bg-transparent'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-sm text-[#1C110C]">
                  <span>Standard Insulated Ground (3–4 Days)</span>
                  <span className="font-mono-num">FREE</span>
                </div>
                <p className="mt-1 text-xs text-[#5C493E]">
                  Recommended for ambient climates under 22°C.
                </p>
              </button>
            </div>
          </section>

          {/* 4. Payment Method */}
          <section className="rounded-2xl bg-[#F4EFE6] p-6 sm:p-8 border border-[#1C110C]/8 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
              04. Select Payment Method
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'UPI' as PaymentMethodType, label: 'UPI Instant', icon: Smartphone },
                { id: 'Card' as PaymentMethodType, label: 'Credit / Debit Card', icon: CreditCard },
                { id: 'NetBanking' as PaymentMethodType, label: 'Net Banking', icon: Building2 },
                { id: 'COD' as PaymentMethodType, label: 'Cash on Delivery', icon: Banknote },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      active
                        ? 'border-[#C59B27] bg-[#1C110C] text-[#FBF9F5]'
                        : 'border-[#1C110C]/15 bg-[#FBF9F5] text-[#1C110C] hover:border-[#1C110C]/40'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${active ? 'text-[#C59B27]' : 'text-[#8C6D46]'}`} />
                    <span className="text-xs font-semibold whitespace-nowrap">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Payment Input Details */}
            <div className="pt-3">
              {paymentMethod === 'UPI' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1.5">
                    Enter Virtual Payment Address (UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C110C]"
                  />
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1.5">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C110C] font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1.5">
                      Expiry / CVC
                    </label>
                    <input
                      type="text"
                      defaultValue="08/29 · 842"
                      className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C110C] font-mono-num"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'NetBanking' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C493E] mb-1.5">
                    Preferred Banking Institution
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-lg border border-[#1C110C]/20 bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C110C]"
                  />
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="rounded-xl bg-[#C59B27]/15 p-4 text-xs text-[#3D2E26]">
                  <span className="font-semibold text-[#1C110C]">Cash on Delivery Verified: </span>
                  Pay <span className="font-mono-num font-semibold">${total.toFixed(2)}</span> in cash or via doorstep QR scan upon receiving your chilled DESHAWN parcel. No extra COD handling fee.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 5. Order Summary & Place Order Button */}
        <div className="lg:col-span-5 rounded-2xl bg-[#F4EFE6] p-6 sm:p-8 border border-[#1C110C]/10 space-y-6">
          <h2 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
            05. Order Summary
          </h2>

          <div className="divide-y divide-[#1C110C]/10 max-h-72 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => {
              const price = product.discountPrice ?? product.price;
              return (
                <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-12 rounded-lg object-cover bg-[#1C110C]"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1C110C] line-clamp-1">
                        {product.name}
                      </h4>
                      <span className="text-xs text-[#6E5A4F] font-mono-num">
                        Qty: {quantity} × ${price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono-num text-sm font-semibold text-[#1C110C]">
                    ${(price * quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#1C110C]/10 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5C493E]">Subtotal</span>
              <span className="font-mono-num text-[#1C110C]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5C493E]">Delivery ({deliveryMethod === 'chilled_express' ? 'Chilled Express' : 'Standard'})</span>
              <span className="font-mono-num text-[#1C110C]">
                {deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#2E5A36]">
                <span>Privilege Discount</span>
                <span className="font-mono-num">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-[#1C110C]/15 flex justify-between items-baseline">
              <span className="font-semibold text-[#1C110C]">Total Payable</span>
              <span className="font-mono-num text-2xl font-semibold text-[#1C110C]">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#1C110C] hover:bg-[#332018] text-[#FBF9F5] font-semibold text-sm transition-all cursor-pointer shadow-lg whitespace-nowrap"
          >
            <span>Place Order · ${total.toFixed(2)}</span>
            <ArrowRight className="w-4 h-4 text-[#C59B27]" />
          </button>
        </div>
      </form>
    </div>
  );
};

interface OrderConfirmationAndTrackerProps {
  order: OrderRecord;
  onAdvanceOrderStep: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationAndTracker: React.FC<OrderConfirmationAndTrackerProps> = ({
  order,
  onAdvanceOrderStep,
  onContinueShopping,
}) => {
  const steps = [
    { step: 1, title: 'Order Confirmed', desc: 'Received at DESHAWN Confectionery Atelier' },
    { step: 2, title: 'Chilled Thermal Packing', desc: 'Hand-packed with gold ribbon & cold gel packs' },
    { step: 3, title: 'In Express Transit', desc: 'Temperature-monitored courier en route' },
    { step: 4, title: 'Delivered', desc: 'Arrived fresh at your doorstep' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="rounded-2xl bg-[#F4EFE6] p-6 sm:p-10 border border-[#1C110C]/10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1C110C]/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#2E5A36]/15 text-[#2E5A36] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2E5A36] font-semibold">
                Order Confirmed · Thank You, {order.customer.fullName}
              </p>
              <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#1C110C]">
                Order #{order.orderId}
              </h1>
            </div>
          </div>

          <div className="text-right font-mono-num">
            <span className="block text-xs text-[#6E5A4F]">Estimated Arrival</span>
            <span className="text-sm font-semibold text-[#1C110C]">{order.estimatedArrival}</span>
          </div>
        </div>

        {/* Live Order Status Tracker */}
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif-display text-2xl font-semibold text-[#1C110C]">
              Live Order Tracking
            </h2>
            {order.statusStep < 4 && (
              <button
                type="button"
                onClick={onAdvanceOrderStep}
                className="px-3.5 py-1.5 rounded-lg bg-[#1C110C] text-[#FBF9F5] text-xs font-medium hover:bg-[#332018] transition-colors cursor-pointer whitespace-nowrap"
              >
                Simulate Next Courier Milestone
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {steps.map((s) => {
              const isDone = order.statusStep >= s.step;
              const isCurrent = order.statusStep === s.step;
              return (
                <div
                  key={s.step}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-[#C59B27] bg-[#FBF9F5] shadow-sm'
                      : isDone
                      ? 'border-[#2E5A36]/30 bg-[#FBF9F5]/60'
                      : 'border-[#1C110C]/10 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono-num text-xs font-semibold text-[#8C6D46]">
                      0{s.step}
                    </span>
                    {isDone ? (
                      <PackageCheck className="w-4 h-4 text-[#2E5A36]" />
                    ) : (
                      <Clock className="w-4 h-4 text-[#8C7A6E]" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-[#1C110C]">{s.title}</h3>
                  <p className="mt-1 text-xs text-[#5C493E]">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery & Payment Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-[#1C110C]/10 text-sm">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#6E5A4F] font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>Delivery Destination</span>
            </div>
            <p className="font-semibold text-[#1C110C]">{order.customer.fullName}</p>
            <p className="text-[#5C493E]">{order.customer.addressLine}</p>
            <p className="text-[#5C493E]">
              {order.customer.city}, {order.customer.state} {order.customer.postalCode}
            </p>
            <p className="text-xs text-[#6E5A4F] mt-1">Contact: {order.customer.phone}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#6E5A4F] font-semibold mb-2">
              <Truck className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>Payment & Dispatch Summary</span>
            </div>
            <p className="text-[#3D2E26]">
              Payment Method: <span className="font-semibold text-[#1C110C]">{order.paymentMethod}</span>
            </p>
            <p className="text-[#3D2E26]">
              Shipping Tier:{' '}
              <span className="font-semibold text-[#1C110C]">
                {order.deliveryMethod === 'chilled_express'
                  ? 'Chilled Express Air'
                  : 'Standard Insulated'}
              </span>
            </p>
            <p className="font-mono-num text-base font-semibold text-[#1C110C] mt-2">
              Total Paid: ${order.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-[#6E5A4F] font-semibold">
            Items in This Shipment
          </h3>
          {order.items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center justify-between text-sm py-1.5">
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <span className="font-medium text-[#1C110C]">
                  {product.name} <span className="text-[#6E5A4F] font-mono-num">× {quantity}</span>
                </span>
              </div>
              <span className="font-mono-num font-semibold text-[#1C110C]">
                ${((product.discountPrice ?? product.price) * quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-[#1C110C]/10 flex justify-end">
          <button
            type="button"
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1C110C] text-[#FBF9F5] text-sm font-semibold hover:bg-[#332018] transition-colors cursor-pointer"
          >
            <span>Continue Exploring DESHAWN</span>
            <ArrowRight className="w-4 h-4 text-[#C59B27]" />
          </button>
        </div>
      </div>
    </div>
  );
};
