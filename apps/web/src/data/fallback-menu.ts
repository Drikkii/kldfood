import type { MenuCategory, MenuProduct } from "../types/catalog";
import menuSeed from "../../../api/data/menu-seed.json";

export const FALLBACK_CATEGORIES = menuSeed.categories as MenuCategory[];
export const FALLBACK_PRODUCTS = menuSeed.products as MenuProduct[];

export function getFallbackMenu() {
  return {
    categories: FALLBACK_CATEGORIES,
    products: FALLBACK_PRODUCTS,
  };
}
