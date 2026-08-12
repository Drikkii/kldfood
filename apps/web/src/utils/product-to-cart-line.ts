import type { CartLine, MenuProduct } from "../types/catalog";
import { productDisplayPrice } from "./menu-pricing";
import { buildProductSelections, getSelectedSizeOption, sizeVariantCartLabel, type ProductSelection } from "./product-size";

export function productToCartLine(
  product: MenuProduct,
  selections: ProductSelection[] = buildProductSelections(product),
): CartLine {
  const sizeOption = getSelectedSizeOption(product, selections);
  return {
    productId: product.id,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl,
    name: product.name,
    quantity: 1,
    unitPrice: productDisplayPrice(product, selections),
    selections,
    modifiers: [],
    variantLabel: sizeOption ? sizeVariantCartLabel(sizeOption) : undefined,
  };
}
