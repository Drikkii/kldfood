import type { CartLine, MenuProduct } from "../types/catalog";
import { productDisplayMeta, productDisplayPrice } from "./menu-pricing";
import { buildProductSelections, getSelectedSizeOption, getSelectedSauceOption, sizeVariantCartLabel, variantOptionCartLabel, type ProductSelection } from "./product-size";

function buildVariantCartLabel(
  product: MenuProduct,
  selections: ProductSelection[],
  metaLabel: string | null,
): string | undefined {
  const parts: string[] = [];
  const sizeOption = getSelectedSizeOption(product, selections);
  const sauceOption = getSelectedSauceOption(product, selections);

  if (sizeOption) parts.push(sizeVariantCartLabel(sizeOption));
  if (sauceOption) parts.push(variantOptionCartLabel(sauceOption));

  if (parts.length > 0) return parts.join(", ");
  return metaLabel ?? undefined;
}

export function productToCartLine(
  product: MenuProduct,
  selections: ProductSelection[] = buildProductSelections(product),
): CartLine {
  const metaLabel = productDisplayMeta(product, selections);
  return {
    productId: product.id,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl,
    name: product.name,
    quantity: 1,
    unitPrice: productDisplayPrice(product, selections),
    selections,
    modifiers: [],
    variantLabel: buildVariantCartLabel(product, selections, metaLabel),
  };
}
