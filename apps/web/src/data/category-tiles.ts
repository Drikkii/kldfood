import type { MenuProduct } from "../types/catalog";
import type { CategoryNavTile } from "./category-nav-tiles";
import { categoryMinPrice } from "../utils/menu-pricing";
import { categoryImageUrl } from "./placeholder-images";

export const CATEGORY_TILE_ACCENTS: Record<string, string> = {
  "cat-shawarma": "#1a1a1a",
  "cat-doner": "#242424",
  "cat-lavash-dogs": "#222222",
  "cat-potato": "#1e1e1e",
  "cat-sauces": "#282828",
  "cat-drinks": "#1a1a1a",
  "cat-spoons": "#2a2a2a",
  "cat-napkins": "#303030",
};

export function categoryTileAccent(imageKey: string): string {
  return CATEGORY_TILE_ACCENTS[imageKey] ?? "#1a1a1a";
}

export function categoryTileImage(imageKey: string, imageUrl?: string | null): string {
  return categoryImageUrl(imageKey, imageUrl);
}

export function navTileMinPrice(
  tile: CategoryNavTile,
  productsByCategory: Map<string, MenuProduct[]>,
): number | null {
  const all: MenuProduct[] = [];
  for (const catId of tile.priceCategoryIds) {
    all.push(...(productsByCategory.get(catId) ?? []));
  }
  return categoryMinPrice(all);
}
