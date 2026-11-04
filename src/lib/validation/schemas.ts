export interface ValidationResult<T> {
  isValid: boolean;
  errors: string[];
  data?: T;
}

export interface EnquiryInput {
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  notes?: string;
  cartItems: Array<{
    id?: string;
    merchandise: {
      id: string;
      title?: string;
      price?: {
        amount: string;
        currencyCode: string;
      };
    };
    quantity: number;
  }>;
  subtotal: string | number;
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+]?[\d\s().-]{7,30}$/;

export function validateEnquiryInput(raw: unknown): ValidationResult<EnquiryInput> {
  const errors: string[] = [];
  if (!raw || typeof raw !== "object") {
    return { isValid: false, errors: ["Invalid request body; expected JSON object"] };
  }

  const obj = raw as Record<string, unknown>;

  // Customer Name
  if (typeof obj.customerName !== "string" || !obj.customerName.trim()) {
    errors.push("customerName is required");
  } else if (obj.customerName.trim().length > 100) {
    errors.push("customerName must not exceed 100 characters");
  }

  // Email
  if (typeof obj.email !== "string" || !obj.email.trim()) {
    errors.push("email is required");
  } else if (obj.email.length > 255 || !EMAIL_REGEX.test(obj.email.trim())) {
    errors.push("A valid email address is required");
  }

  // Phone
  if (typeof obj.phone !== "string" || !obj.phone.trim()) {
    errors.push("phone is required");
  } else if (!PHONE_REGEX.test(obj.phone.trim())) {
    errors.push("A valid phone number is required");
  }

  // Delivery Address
  if (typeof obj.deliveryAddress !== "string" || obj.deliveryAddress.trim().length < 5) {
    errors.push("deliveryAddress is required and must be at least 5 characters");
  } else if (obj.deliveryAddress.trim().length > 500) {
    errors.push("deliveryAddress must not exceed 500 characters");
  }

  // Notes (optional)
  if (obj.notes !== undefined && obj.notes !== null) {
    if (typeof obj.notes !== "string") {
      errors.push("notes must be a string");
    } else if (obj.notes.length > 1000) {
      errors.push("notes must not exceed 1000 characters");
    }
  }

  // Cart Items
  if (!Array.isArray(obj.cartItems) || obj.cartItems.length === 0) {
    errors.push("cartItems must be a non-empty array");
  } else if (obj.cartItems.length > 100) {
    errors.push("cartItems cannot exceed 100 items");
  } else {
    for (let i = 0; i < obj.cartItems.length; i++) {
      const item = obj.cartItems[i];
      if (!item || typeof item !== "object") {
        errors.push(`cartItems[${i}] must be an object`);
        continue;
      }
      if (typeof item.quantity !== "number" || item.quantity <= 0 || !Number.isInteger(item.quantity) || item.quantity > 999) {
        errors.push(`cartItems[${i}].quantity must be a positive integer <= 999`);
      }
      if (!item.merchandise || typeof item.merchandise !== "object" || typeof item.merchandise.id !== "string" || !item.merchandise.id) {
        errors.push(`cartItems[${i}].merchandise.id is required`);
      }
    }
  }

  // Subtotal
  if (obj.subtotal === undefined || obj.subtotal === null) {
    errors.push("subtotal is required");
  } else {
    const num = typeof obj.subtotal === "number" ? obj.subtotal : parseFloat(String(obj.subtotal));
    if (isNaN(num) || num < 0) {
      errors.push("subtotal must be a valid non-negative number");
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      customerName: (obj.customerName as string).trim(),
      email: (obj.email as string).trim().toLowerCase(),
      phone: (obj.phone as string).trim(),
      deliveryAddress: (obj.deliveryAddress as string).trim(),
      notes: typeof obj.notes === "string" ? obj.notes.trim() : undefined,
      cartItems: obj.cartItems as EnquiryInput["cartItems"],
      subtotal: obj.subtotal as string | number,
    },
  };
}

export type CartAction = "create" | "add" | "update" | "remove" | "get";

export interface CartInputPayload {
  action: CartAction;
  cartId?: string;
  lines?: Array<{ merchandiseId: string; quantity: number }>;
  lineIds?: string[];
  input?: Record<string, unknown>;
}

export function validateCartInput(raw: unknown): ValidationResult<CartInputPayload> {
  const errors: string[] = [];
  if (!raw || typeof raw !== "object") {
    return { isValid: false, errors: ["Invalid request body; expected JSON object"] };
  }

  const obj = raw as Record<string, unknown>;
  const allowedActions: CartAction[] = ["create", "add", "update", "remove", "get"];

  if (typeof obj.action !== "string" || !allowedActions.includes(obj.action as CartAction)) {
    return { isValid: false, errors: [`Invalid cart action: must be one of ${allowedActions.join(", ")}`] };
  }

  const action = obj.action as CartAction;

  if (action !== "create") {
    if (typeof obj.cartId !== "string" || !obj.cartId.trim()) {
      errors.push("cartId is required for this action");
    } else if (obj.cartId.length > 255) {
      errors.push("cartId must not exceed 255 characters");
    }
  }

  if (action === "add" || action === "update") {
    if (!Array.isArray(obj.lines) || obj.lines.length === 0) {
      errors.push("lines must be a non-empty array for add/update");
    } else if (obj.lines.length > 50) {
      errors.push("lines cannot exceed 50 items per operation");
    } else {
      for (let i = 0; i < obj.lines.length; i++) {
        const line = obj.lines[i];
        if (!line || typeof line !== "object") {
          errors.push(`lines[${i}] must be an object`);
          continue;
        }
        if (action === "add" && (typeof line.merchandiseId !== "string" || !line.merchandiseId.trim())) {
          errors.push(`lines[${i}].merchandiseId is required`);
        }
        if (action === "update" && (typeof line.id !== "string" || !line.id.trim())) {
          errors.push(`lines[${i}].id is required`);
        }
        if (typeof line.quantity !== "number" || line.quantity < 0 || !Number.isInteger(line.quantity) || line.quantity > 999) {
          errors.push(`lines[${i}].quantity must be an integer between 0 and 999`);
        }
      }
    }
  }

  if (action === "remove") {
    if (!Array.isArray(obj.lineIds) || obj.lineIds.length === 0) {
      errors.push("lineIds must be a non-empty array of string IDs");
    } else if (obj.lineIds.length > 50) {
      errors.push("lineIds cannot exceed 50 items per operation");
    } else {
      for (let i = 0; i < obj.lineIds.length; i++) {
        if (typeof obj.lineIds[i] !== "string" || !obj.lineIds[i].trim()) {
          errors.push(`lineIds[${i}] must be a non-empty string`);
        }
      }
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      action,
      cartId: typeof obj.cartId === "string" ? obj.cartId.trim() : undefined,
      lines: obj.lines as CartInputPayload["lines"],
      lineIds: obj.lineIds as string[],
      input: obj.input as Record<string, unknown>,
    },
  };
}

export const ALLOWED_SHOPIFY_OPERATIONS = new Set([
  "getProducts",
  "getProductByHandle",
  "getCollections",
  "getCollectionByHandle",
  "searchProducts",
  "getCart",
  "cartCreate",
  "cartLinesAdd",
  "cartLinesUpdate",
  "cartLinesRemove",
]);

export interface ShopifyQueryPayload {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
}

export function validateShopifyPayload(raw: unknown): ValidationResult<ShopifyQueryPayload> {
  const errors: string[] = [];
  if (!raw || typeof raw !== "object") {
    return { isValid: false, errors: ["Invalid request body; expected JSON object"] };
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.query !== "string" || !obj.query.trim()) {
    return { isValid: false, errors: ["GraphQL query string is required"] };
  }

  if (obj.query.length > 10_000) {
    return { isValid: false, errors: ["Query size exceeds 10KB limit"] };
  }

  // Detect operation name from payload or extract from query string
  let opName = typeof obj.operationName === "string" ? obj.operationName.trim() : undefined;
  if (!opName) {
    const match = obj.query.match(/(?:query|mutation)\s+([A-Za-z0-9_]+)/);
    if (match && match[1]) {
      opName = match[1];
    }
  }

  if (!opName || !ALLOWED_SHOPIFY_OPERATIONS.has(opName)) {
    return {
      isValid: false,
      errors: [
        `Operation "${opName || 'anonymous'}" is not permitted. Only allowlisted storefront operations are allowed.`,
      ],
    };
  }

  // Variables validation
  if (obj.variables !== undefined && obj.variables !== null) {
    if (typeof obj.variables !== "object" || Array.isArray(obj.variables)) {
      errors.push("variables must be a key-value object");
    } else {
      const vars = obj.variables as Record<string, unknown>;
      if (vars.first !== undefined && (typeof vars.first !== "number" || vars.first <= 0 || vars.first > 100)) {
        errors.push("Variable 'first' must be an integer between 1 and 100");
      }
      if (vars.handle !== undefined && (typeof vars.handle !== "string" || vars.handle.length > 255)) {
        errors.push("Variable 'handle' must be a string <= 255 characters");
      }
      if (vars.cartId !== undefined && (typeof vars.cartId !== "string" || vars.cartId.length > 255)) {
        errors.push("Variable 'cartId' must be a string <= 255 characters");
      }
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      query: obj.query,
      variables: obj.variables as Record<string, unknown> | undefined,
      operationName: opName,
    },
  };
}
