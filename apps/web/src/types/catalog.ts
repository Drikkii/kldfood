export type Fulfillment = "delivery" | "pickup";

export type Location = {
  id: string;
  name: string;
  address: string;
  city: string;
  pickup: boolean;
  delivery: boolean;
  workHours: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  sort: number;
  imageUrl?: string;
};

export type VariantOption = {
  id: string;
  name: string;
  price: number;
  weightGrams?: number;
  isDefault?: boolean;
};

export type VariantGroup = {
  id: string;
  name: string;
  required?: boolean;
  options: VariantOption[];
};

export type ModifierOption = {
  id: string;
  name: string;
  price: number;
  maxQuantity?: number;
  stopped?: boolean;
};

export type ModifierGroup = {
  id: string;
  name: string;
  minPick?: number;
  maxPick?: number;
  modifiers: ModifierOption[];
};

export type MenuProduct = {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  weightGrams?: number;
  priceFrom?: number;
  basePrice?: number;
  rating?: number;
  stopped?: boolean;
  variantGroups?: VariantGroup[];
  modifierGroups?: ModifierGroup[];
};

export type CartModifier = {
  modifierId: string;
  quantity: number;
};

export type CartLine = {
  productId: string;
  categoryId?: string;
  imageUrl?: string;
  name: string;
  quantity: number;
  /** Для UI; checkout пересчитывает backend */
  unitPrice: number;
  selections: { groupId: string; optionId: string }[];
  modifiers: CartModifier[];
  variantLabel?: string;
  extrasLabel?: string;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  email?: string;
};
