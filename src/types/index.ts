export interface ImageNode {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  barcode?: string | null;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money | null;
  selectedOptions?: {
    name: string;
    value: string;
  }[];
}

export interface ProductRating {
  value: number;
  count: number;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: ImageNode;
  images: ImageNode[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  collections?: string[];
  sku?: string;
  barcode?: string;
  rating?: ProductRating;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: ImageNode;
  productCount: number;
}

export interface CartLineItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    sku: string;
    product: {
      id: string;
      title: string;
      handle: string;
      featuredImage: ImageNode;
      vendor: string;
    };
    price: Money;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLineItem[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount?: Money | null;
  };
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string | null;
  defaultAddress?: {
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  } | null;
  orders: CustomerOrder[];
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: Money;
  lineItems: {
    title: string;
    quantity: number;
    price: Money;
  }[];
}

export interface BundleOffer {
  id: string;
  title: string;
  tagline: string;
  productTitle: string;
  price: number;
  originalPrice?: number;
  individualCountText: string;
  handle: string;
  image?: string;
}

export interface OrderEnquirySubmission {
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  notes?: string;
  cartItems: {
    title: string;
    quantity: number;
    price: string;
  }[];
}

