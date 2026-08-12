import { fetchMenu } from "../api/client";
import { getFallbackMenu } from "../data/fallback-menu";
import type { MenuCategory, MenuProduct } from "../types/catalog";
import { ensureMenuProductSizes } from "./product-size";

export async function loadMenu(locationId?: string | null): Promise<{
  categories: MenuCategory[];
  products: MenuProduct[];
}> {
  try {
    const data = await fetchMenu(locationId ?? null);
    if (data.categories.length === 0) {
      const fallback = getFallbackMenu();
      return { ...fallback, products: ensureMenuProductSizes(fallback.products) };
    }
    return {
      categories: data.categories,
      products: ensureMenuProductSizes(data.products as MenuProduct[]),
    };
  } catch {
    const fallback = getFallbackMenu();
    return { ...fallback, products: ensureMenuProductSizes(fallback.products) };
  }
}
