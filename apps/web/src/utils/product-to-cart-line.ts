import type { CartLine, MenuProduct } from "../types/catalog";
import { defaultSelections, productDisplayPrice } from "./menu-pricing";

export function productToCartLine(product: MenuProduct): CartLine {
  const selections = defaultSelections(product);
  return {
    productId: product.id,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl,
    name: product.name,
    quantity: 1,
    unitPrice: productDisplayPrice(product),
    selections,
    modifiers: [],
  };
}
