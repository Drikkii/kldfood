import { fetchMenu } from "../api/client";
import { getFallbackMenu } from "../data/fallback-menu";
import type { MenuCategory, MenuProduct } from "../types/catalog";

export async function loadMenu(locationId?: string | null): Promise<{
  categories: MenuCategory[];
  products: MenuProduct[];
}> {
  try {
    const data = await fetchMenu(locationId ?? null);
    if (data.categories.length === 0) return getFallbackMenu();
    return {
      categories: data.categories,
      products: data.products as MenuProduct[],
    };
  } catch {
    return getFallbackMenu();
  }
}
