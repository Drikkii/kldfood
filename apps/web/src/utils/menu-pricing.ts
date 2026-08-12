import type { MenuProduct } from "../types/catalog";

export function defaultSelections(product: MenuProduct) {
  return (product.variantGroups ?? [])
    .map((g) => ({
      groupId: g.id,
      optionId: g.options.find((o) => o.isDefault)?.id ?? g.options[0]?.id ?? "",
    }))
    .filter((s) => s.optionId);
}

export function productDisplayPrice(product: MenuProduct): number {
  if (product.basePrice != null) return product.basePrice;
  if (product.priceFrom != null) return product.priceFrom;
  const selections = defaultSelections(product);
  for (const sel of selections) {
    const group = product.variantGroups?.find((g) => g.id === sel.groupId);
    const opt = group?.options.find((o) => o.id === sel.optionId);
    if (opt) return opt.price;
  }
  return product.variantGroups?.[0]?.options[0]?.price ?? 0;
}

/** «от» только если задан priceFrom без вариантов (конструктор и т.п.). */
export function productPriceLabel(product: MenuProduct): string {
  const price = productDisplayPrice(product);
  const showFrom =
    product.priceFrom != null && (product.variantGroups?.length ?? 0) === 0;
  return showFrom ? `от ${price} ₽` : `${price} ₽`;
}

export function categoryMinPrice(products: MenuProduct[]): number | null {
  if (products.length === 0) return null;
  return Math.min(...products.map(productDisplayPrice));
}
