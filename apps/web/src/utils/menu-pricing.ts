import type { MenuProduct } from "../types/catalog";
import {
  buildProductSelections,
  getSelectedSizeOption,
  getSizeVariantGroup,
  isSizeVariantGroup,
  type ProductSelection,
} from "./product-size";

export function defaultSelections(product: MenuProduct): ProductSelection[] {
  return buildProductSelections(product);
}

function priceFromSelections(product: MenuProduct, selections: ProductSelection[]): number {
  const groups = product.variantGroups ?? [];
  if (groups.length === 0) {
    if (product.basePrice != null) return product.basePrice;
    if (product.priceFrom != null) return product.priceFrom;
    return 0;
  }

  let sizePrice: number | null = null;
  let extras = 0;

  for (const sel of selections) {
    const group = groups.find((g) => g.id === sel.groupId);
    const opt = group?.options.find((o) => o.id === sel.optionId);
    if (!group || !opt) continue;

    if (isSizeVariantGroup(group)) {
      sizePrice = opt.price;
      continue;
    }

    extras += opt.priceDelta ?? opt.price ?? 0;
  }

  if (sizePrice != null) return sizePrice + extras;

  if (product.basePrice != null) return product.basePrice + extras;
  if (product.priceFrom != null) return product.priceFrom + extras;
  return extras;
}

export function productDisplayPrice(
  product: MenuProduct,
  selections: ProductSelection[] = defaultSelections(product),
): number {
  return priceFromSelections(product, selections);
}

export function productDisplayWeight(
  product: MenuProduct,
  selections: ProductSelection[] = defaultSelections(product),
): number | null {
  if (product.pieceCount != null) return null;

  const sizeOption = getSelectedSizeOption(product, selections);
  if (sizeOption?.weightGrams != null) return sizeOption.weightGrams;

  for (const sel of selections) {
    const group = product.variantGroups?.find((g) => g.id === sel.groupId);
    const opt = group?.options.find((o) => o.id === sel.optionId);
    if (opt?.weightGrams != null) return opt.weightGrams;
  }

  return product.weightGrams ?? null;
}

export function productDisplayMeta(
  product: MenuProduct,
  selections: ProductSelection[] = defaultSelections(product),
): string | null {
  if (product.pieceCount != null) return `${product.pieceCount} шт`;

  const weight = productDisplayWeight(product, selections);
  if (weight != null) return `${weight} г`;

  return null;
}

export function productPriceLabel(
  product: MenuProduct,
  selections?: ProductSelection[],
): string {
  return `${productDisplayPrice(product, selections)} ₽`;
}

export function productMinPrice(product: MenuProduct): number {
  const sizeGroup = getSizeVariantGroup(product);
  if (sizeGroup && sizeGroup.options.length > 0) {
    return Math.min(...sizeGroup.options.map((o) => o.price));
  }
  if (product.basePrice != null) return product.basePrice;
  if (product.priceFrom != null) return product.priceFrom;
  return productDisplayPrice(product);
}

export function categoryMinPrice(products: MenuProduct[]): number | null {
  if (products.length === 0) return null;
  return Math.min(...products.map(productMinPrice));
}
