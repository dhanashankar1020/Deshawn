import heroImg from '../assets/images/hero_deshawn_chocolate_1791195623276.jpg';
import darkImg from '../assets/images/prod_dark_chocolate_1791195643832.jpg';
import milkImg from '../assets/images/prod_milk_chocolate_1791195662320.jpg';
import hazelnutImg from '../assets/images/prod_hazelnut_chocolate_1791195679337.jpg';
import caramelImg from '../assets/images/prod_caramel_chocolate_1791195694111.jpg';
import almondImg from '../assets/images/prod_almond_chocolate_1791195706892.jpg';
import giftBoxImg from '../assets/images/prod_gift_box_1791195718657.jpg';
import lifestyleImg from '../assets/images/ad_lifestyle_tasting_1791195730497.jpg';

export type ProductCategory = 'Dark Chocolate' | 'Milk Chocolate' | 'Nuts & Praline' | 'Caramel & Sea Salt' | 'Gift Boxes';

export interface NutritionInfo {
  servingSize: string;
  calories: number;
  totalFat: string;
  saturatedFat: string;
  carbohydrates: string;
  sugars: string;
  protein: string;
}

export interface ProductReview {
  id: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface ChocolateProduct {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  shortDescription: string;
  fullDescription: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  cocoaPercentage: number;
  weightGrams: number;
  origin: string;
  tastingNotes: string[];
  ingredients: string[];
  allergens: string;
  nutrition: NutritionInfo;
  image: string;
  gallery: string[];
  featured: boolean;
  bestSeller: boolean;
  tag?: string;
  deliveryEstimate: string;
  reviews: ProductReview[];
}

export interface CartItem {
  product: ChocolateProduct;
  quantity: number;
  giftMessage?: string;
}

export type PaymentMethodType = 'UPI' | 'Card' | 'NetBanking' | 'COD';

export interface OrderRecord {
  orderId: string;
  placedAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
  };
  deliveryMethod: 'standard' | 'chilled_express';
  paymentMethod: PaymentMethodType;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  total: number;
  statusStep: 1 | 2 | 3 | 4; // 1: Confirmed, 2: Chilled Packing, 3: In Transit, 4: Delivered
  estimatedArrival: string;
}

export const IMAGES = {
  hero: heroImg,
  dark: darkImg,
  milk: milkImg,
  hazelnut: hazelnutImg,
  caramel: caramelImg,
  almond: almondImg,
  giftBox: giftBoxImg,
  lifestyle: lifestyleImg,
};

export const PRODUCTS: ChocolateProduct[] = [
  {
    id: 'deshawn-noir-85',
    name: 'Noir 85% Single-Origin Dark Chocolate',
    subtitle: 'Arriba Nacional Ecuadorian Cacao',
    category: 'Dark Chocolate',
    shortDescription: 'Intense, velvety 85% dark couverture with subtle notes of roasted espresso, blackberry, and warm cedar.',
    fullDescription: 'Conched for 72 hours in small granite mills, DESHAWN Noir 85% showcases single-estate Arriba Nacional cacao beans harvested in Los Ríos, Ecuador. Expect a crisp, resonant snap followed by an extraordinarily smooth melt without bitterness.',
    price: 18.00,
    discountPrice: 15.00,
    rating: 4.9,
    reviewCount: 142,
    cocoaPercentage: 85,
    weightGrams: 100,
    origin: 'Los Ríos, Ecuador',
    tastingNotes: ['Roasted Espresso', 'Dried Blackberry', 'Warm Cedar'],
    ingredients: ['Organic Cocoa Mass', 'Raw Cane Sugar', 'Single-Origin Cocoa Butter', 'Madagascar Bourbon Vanilla Bean'],
    allergens: 'Crafted in an atelier that handles tree nuts and dairy. Soy-free & Gluten-free.',
    nutrition: {
      servingSize: '40g (4 squares)',
      calories: 230,
      totalFat: '19g',
      saturatedFat: '11g',
      carbohydrates: '11g',
      sugars: '5g',
      protein: '4.5g',
    },
    image: IMAGES.dark,
    gallery: [IMAGES.dark, IMAGES.hero, IMAGES.lifestyle],
    featured: true,
    bestSeller: true,
    tag: 'Best Seller',
    deliveryEstimate: 'Ships in insulated cold-pack · Arrives in 1–2 business days',
    reviews: [
      {
        id: 'rev-1',
        author: 'Elena Rostova',
        role: 'Pastry Chef, Atelier Lumière',
        location: 'New York, NY',
        rating: 5,
        date: 'September 18, 2026',
        title: 'Unmatched temper and aromatic depth',
        comment: 'We switched our tasting room mignardises to DESHAWN Noir 85%. The snap is razor-sharp and the finish has zero astringency—pure floral cocoa.',
        verifiedPurchase: true,
      },
      {
        id: 'rev-2',
        author: 'Marcus Vance',
        role: 'Sommelier & Collector',
        location: 'San Francisco, CA',
        rating: 5,
        date: 'September 04, 2026',
        title: 'Pairs effortlessly with aged Cabernet or neat espresso',
        comment: 'Most 85% bars feel chalky. DESHAWN melts like silk at room temperature. The gold-embossed packaging also keeps it airtight.',
        verifiedPurchase: true,
      }
    ],
  },
  {
    id: 'deshawn-velours-milk',
    name: 'Velours 45% Alpine Milk Chocolate',
    subtitle: 'Caramelized Meadow Milk & Criollo Cacao',
    category: 'Milk Chocolate',
    shortDescription: 'High-cacao Swiss-style milk chocolate balanced with caramelized alpine cream and Tahitian vanilla.',
    fullDescription: 'Far removed from ordinary sweet confections, our Velours 45% Milk Chocolate elevates milk chocolate into a sophisticated tasting experience. High-altitude alpine cream is gently caramelized before blending with fine Criollo cocoa butter.',
    price: 16.00,
    rating: 4.8,
    reviewCount: 98,
    cocoaPercentage: 45,
    weightGrams: 100,
    origin: 'Sur del Lago, Venezuela',
    tastingNotes: ['Brown Butter', 'Sweet Cream', 'Tahitian Vanilla'],
    ingredients: ['Cocoa Butter', 'Whole Alpine Milk Powder', 'Unrefined Cane Sugar', 'Cocoa Mass', 'Tahitian Vanilla Extract'],
    allergens: 'Contains Milk. May contain traces of hazelnuts and almonds.',
    nutrition: {
      servingSize: '40g (4 squares)',
      calories: 225,
      totalFat: '16g',
      saturatedFat: '10g',
      carbohydrates: '17g',
      sugars: '14g',
      protein: '3.8g',
    },
    image: IMAGES.milk,
    gallery: [IMAGES.milk, IMAGES.hero, IMAGES.giftBox],
    featured: true,
    bestSeller: false,
    tag: 'Signature Melt',
    deliveryEstimate: 'Ships in insulated cold-pack · Arrives in 1–2 business days',
    reviews: [
      {
        id: 'rev-3',
        author: 'Claire Beaumont',
        role: 'Editorial Director',
        location: 'Chicago, IL',
        rating: 5,
        date: 'August 29, 2026',
        title: 'Milk chocolate for grown-up palates',
        comment: 'The 45% cocoa content makes all the difference. You taste roasted cocoa and browned butter first, not sugar.',
        verifiedPurchase: true,
      }
    ],
  },
  {
    id: 'deshawn-piedmont-hazelnut',
    name: 'Gianduja Piedmont Hazelnut Chocolate',
    subtitle: 'Whole Roasted IGP Piemonte Hazelnuts',
    category: 'Nuts & Praline',
    shortDescription: 'Silky hazelnut gianduja dark-milk chocolate studded with whole slow-roasted Italian Piedmont hazelnuts.',
    fullDescription: 'Crafted in homage to Turin’s classic confectioners, we stone-grind freshly roasted IGP Piedmont hazelnuts directly into 58% dark-milk chocolate, then fold in whole crunchy roasted nuts for an unforgettable textural contrast.',
    price: 22.00,
    discountPrice: 19.00,
    rating: 5.0,
    reviewCount: 176,
    cocoaPercentage: 58,
    weightGrams: 120,
    origin: 'Piedmont, Italy & Peru',
    tastingNotes: ['Toasted Hazelnut', 'Praline Paste', 'Warm Cocoa'],
    ingredients: ['IGP Piedmont Hazelnuts (34%)', 'Cocoa Mass', 'Cocoa Butter', 'Raw Cane Sugar', 'Whole Milk Powder', 'Fleur de Sel'],
    allergens: 'Contains Hazelnuts and Milk. May contain traces of almonds.',
    nutrition: {
      servingSize: '40g',
      calories: 245,
      totalFat: '18.5g',
      saturatedFat: '7.5g',
      carbohydrates: '14g',
      sugars: '10g',
      protein: '5.2g',
    },
    image: IMAGES.hazelnut,
    gallery: [IMAGES.hazelnut, IMAGES.dark, IMAGES.hero],
    featured: true,
    bestSeller: true,
    tag: 'Best Seller',
    deliveryEstimate: 'Ships in insulated cold-pack · Arrives in 1–2 business days',
    reviews: [
      {
        id: 'rev-4',
        author: 'Julian Sterling',
        role: 'Hospitality Consultant',
        location: 'Boston, MA',
        rating: 5,
        date: 'September 27, 2026',
        title: 'Whole crunchy hazelnuts in every single square',
        comment: 'The aroma when you open the gold foil is intoxicating—like a warm Italian roastery. Worth every penny.',
        verifiedPurchase: true,
      }
    ],
  },
  {
    id: 'deshawn-salted-caramel',
    name: 'Fleur de Sel Liquid Caramel Chocolate',
    subtitle: '70% Dark Shell with Slow-Cooked Copper-Pot Caramel',
    category: 'Caramel & Sea Salt',
    shortDescription: 'Crisp 70% dark chocolate shells filled with flowing golden salted butter caramel and Guérande sea salt.',
    fullDescription: 'Break apart a square to reveal a ribbon of golden, copper-kettle cooked caramel infused with Normandy cultured butter and hand-harvested Guérande fleur de sel, encased in our signature 70% dark couverture.',
    price: 20.00,
    discountPrice: 17.50,
    rating: 4.9,
    reviewCount: 210,
    cocoaPercentage: 70,
    weightGrams: 110,
    origin: 'Madagascar & Brittany, France',
    tastingNotes: ['Burnt Sugar', 'Salted Cultured Butter', 'Dark Berry Cacao'],
    ingredients: ['70% Dark Chocolate (Cocoa Mass, Sugar, Cocoa Butter)', 'Heavy Cream', 'Cultured Butter', 'Cane Sugar', 'Guérande Sea Salt Flakes'],
    allergens: 'Contains Milk. Crafted in a facility that handles tree nuts.',
    nutrition: {
      servingSize: '40g',
      calories: 215,
      totalFat: '15g',
      saturatedFat: '9.5g',
      carbohydrates: '18g',
      sugars: '13g',
      protein: '3.0g',
    },
    image: IMAGES.caramel,
    gallery: [IMAGES.caramel, IMAGES.lifestyle, IMAGES.hero],
    featured: true,
    bestSeller: true,
    tag: 'Most Popular',
    deliveryEstimate: 'Ships in insulated cold-pack · Arrives in 1–2 business days',
    reviews: [
      {
        id: 'rev-5',
        author: 'Sophia Lin',
        role: 'Creative Director',
        location: 'Seattle, WA',
        rating: 5,
        date: 'October 01, 2026',
        title: 'That slow-motion caramel pull is real',
        comment: 'The contrast between the bitter 70% dark shell and the warm, savory sea-salt caramel inside is pure heaven.',
        verifiedPurchase: true,
      }
    ],
  },
  {
    id: 'deshawn-marcona-almond',
    name: 'Caramelized Marcona Almond & Sea Salt',
    subtitle: '68% Dark Chocolate with Spanish Marcona Almonds',
    category: 'Nuts & Praline',
    shortDescription: 'Plump Spanish Marcona almonds lightly glazed in organic blossom honey and roasted into 68% dark chocolate.',
    fullDescription: 'Prized for their sweet, buttery crunch, Spanish Marcona almonds are pan-toasted with a whisper of wildflower honey and flaky sea salt before being hand-set into tempered 68% Dominican single-origin dark chocolate.',
    price: 19.00,
    rating: 4.8,
    reviewCount: 84,
    cocoaPercentage: 68,
    weightGrams: 115,
    origin: 'Alicante, Spain & Dominican Republic',
    tastingNotes: ['Toasted Marcona', 'Wildflower Honey', 'Flaky Sea Salt'],
    ingredients: ['Cocoa Mass', 'Roasted Spanish Marcona Almonds (28%)', 'Raw Cane Sugar', 'Cocoa Butter', 'Organic Wildflower Honey', 'Sea Salt'],
    allergens: 'Contains Almonds. May contain traces of hazelnuts and milk.',
    nutrition: {
      servingSize: '40g',
      calories: 235,
      totalFat: '17.5g',
      saturatedFat: '8g',
      carbohydrates: '13g',
      sugars: '9g',
      protein: '5.5g',
    },
    image: IMAGES.almond,
    gallery: [IMAGES.almond, IMAGES.dark, IMAGES.hero],
    featured: true,
    bestSeller: false,
    tag: 'Limited Batch',
    deliveryEstimate: 'Ships in insulated cold-pack · Arrives in 1–2 business days',
    reviews: [
      {
        id: 'rev-6',
        author: 'David K. Thorne',
        role: 'Architect',
        location: 'Austin, TX',
        rating: 5,
        date: 'September 12, 2026',
        title: 'Crisp, nutty, never overly sweet',
        comment: 'Marcona almonds have a completely different texture from regular almonds—almost buttery. A staple on my desk.',
        verifiedPurchase: true,
      }
    ],
  },
  {
    id: 'deshawn-grand-coffret-24',
    name: 'Le Grand Coffret — 24 Piece Assorted Gift Box',
    subtitle: 'Signature Pralines, Ganaches & Single-Origin Truffles',
    category: 'Gift Boxes',
    shortDescription: 'An heirloom espresso-and-gold presentation box housing 24 handcrafted pralines, truffles, and ganaches.',
    fullDescription: 'Designed for unforgettable gifting and celebratory tastings, Le Grand Coffret contains 24 jewel-like bonbons including Champagne Dark Ganache, 24K Gold Leaf Espresso Praline, Pistachio Gianduja, and Passionfruit Caramel.',
    price: 68.00,
    discountPrice: 58.00,
    rating: 5.0,
    reviewCount: 312,
    cocoaPercentage: 72,
    weightGrams: 340,
    origin: 'Multi-Origin Grand Cru Assortment',
    tastingNotes: ['24K Gold Ganache', 'Pistachio Praline', 'Champagne Truffle'],
    ingredients: ['Single-Origin Dark & Milk Couverture', 'Piedmont Hazelnuts', 'Bronte Pistachios', 'Heavy Cream', 'Cultured Butter', 'Edible 24K Gold Leaf'],
    allergens: 'Contains Milk, Tree Nuts (Hazelnut, Almond, Pistachio). Gluten-free.',
    nutrition: {
      servingSize: '3 pieces (42g)',
      calories: 220,
      totalFat: '16g',
      saturatedFat: '9.5g',
      carbohydrates: '16g',
      sugars: '12g',
      protein: '3.5g',
    },
    image: IMAGES.giftBox,
    gallery: [IMAGES.giftBox, IMAGES.hero, IMAGES.lifestyle],
    featured: true,
    bestSeller: true,
    tag: 'Luxury Gift',
    deliveryEstimate: 'Complimentary satin ribbon & chilled gift delivery in 1–2 days',
    reviews: [
      {
        id: 'rev-7',
        author: 'Victoria Kensington',
        role: 'Managing Partner',
        location: 'London / New York',
        rating: 5,
        date: 'September 29, 2026',
        title: 'Sent 15 boxes to executive clients—rave reviews',
        comment: 'The unboxing experience rivals fine Swiss watchmakers. Every bonbon inside looks like modern sculpture and tastes extraordinary.',
        verifiedPurchase: true,
      }
    ],
  },
];

export interface AdScene {
  id: number;
  label: string;
  title: string;
  narration: string;
  caption: string;
  image: string;
  durationMs: number;
  cameraEffect: string;
}

export const AD_SCENES: AdScene[] = [
  {
    id: 1,
    label: 'Scene 01 · The Monolith',
    title: 'Precision Wrapped in Gold & Deep Cocoa.',
    narration: 'A beautifully packaged DESHAWN chocolate bar rests on a dark slate studio surface as soft directional lighting reveals the tactile grain of matte cocoa paper and gold foil.',
    caption: 'Hand-numbered batch packaging · Embossed in 24K gold foil',
    image: IMAGES.hero,
    durationMs: 5500,
    cameraEffect: 'scale-105 translate-y-1',
  },
  {
    id: 2,
    label: 'Scene 02 · The Unveiling',
    title: 'Unfolding the Ritual.',
    narration: 'The gilded seal slowly parts, releasing warm aromatic waves of roasted Ecuadorian Arriba Nacional cacao and Madagascar vanilla bean.',
    caption: 'Airtight gold-foil inner seal preserves volatile cocoa aromatics',
    image: IMAGES.dark,
    durationMs: 5500,
    cameraEffect: 'scale-110 -translate-x-2',
  },
  {
    id: 3,
    label: 'Scene 03 · Macro Snap',
    title: 'The Sound of Pure Temper.',
    narration: 'In slow-motion macro detail, thick dark couverture breaks cleanly apart, revealing a velvet interior and a ribbon of golden Guérande salted caramel.',
    caption: '72-hour granite conching · Crisp tempered snap at 31.8°C',
    image: IMAGES.caramel,
    durationMs: 5500,
    cameraEffect: 'scale-110 translate-x-2',
  },
  {
    id: 4,
    label: 'Scene 04 · Botanical Alchemy',
    title: 'Rare Origins, Uncompromised.',
    narration: 'Whole roasted IGP Piedmont hazelnuts, Spanish Marcona almonds, single-estate cacao nibs, and flaky sea salt converge around the chocolate.',
    caption: '100% traceable cacao · Zero palm oil · Zero artificial lecithin',
    image: IMAGES.hazelnut,
    durationMs: 5500,
    cameraEffect: 'scale-105 -translate-y-1',
  },
  {
    id: 5,
    label: 'Scene 05 · The Tasting Moment',
    title: 'Savor the Stillness.',
    narration: 'In a warmly lit architectural lounge at dusk, a single square melts effortlessly on the palate—turning an evening pause into an extraordinary ritual.',
    caption: 'Crafted to pair with espresso, aged spirits, or quiet evenings',
    image: IMAGES.lifestyle,
    durationMs: 5500,
    cameraEffect: 'scale-105 translate-x-1',
  },
  {
    id: 6,
    label: 'Scene 06 · The House of DESHAWN',
    title: 'DESHAWN — Taste the Extraordinary.',
    narration: 'From single-origin dark bars to our heirloom 24-piece Grand Coffret, every creation bears the unmistakable signature of DESHAWN.',
    caption: 'Chilled express delivery nationwide · Guaranteed fresh arrival',
    image: IMAGES.giftBox,
    durationMs: 6500,
    cameraEffect: 'scale-100',
  },
];
