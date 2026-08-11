/**
 * Источник меню — R-Keeper (пока mock + стоп-лист по точке).
 * Позже: синк через White Server / ExecuteRk7Query.
 */

import { mockCategories, mockProducts } from "../data/mock-menu.js";

/** productId, `${productId}:${optionId}` или `${productId}:mod:${modifierId}` */
const stopListByLocation = {
  "loc-2": new Set(["fries-classic", "shawarma-chicken:mod:extra-bacon"]),
};

/**
 * @param {string | undefined | null} locationId
 */
export function getCatalogForLocation(locationId) {
  const stopped = stopListByLocation[locationId ?? ""] ?? new Set();
  const products = mockProducts.map((p) => ({
    ...p,
    stopped: stopped.has(p.id),
    variantGroups: p.variantGroups?.map((g) => ({
      ...g,
      options: g.options.map((o) => ({
        ...o,
        stopped: stopped.has(`${p.id}:${o.id}`),
      })),
    })),
    modifierGroups: p.modifierGroups?.map((g) => ({
      ...g,
      modifiers: g.modifiers.map((m) => ({
        ...m,
        stopped: stopped.has(`${p.id}:mod:${m.id}`),
      })),
    })),
  }));

  return {
    source: "rkeeper",
    syncedAt: new Date().toISOString(),
    locationId: locationId ?? null,
    categories: mockCategories,
    products,
  };
}

/**
 * @param {string} locationId
 * @param {string} productId
 */
export function getProductSnapshot(locationId, productId) {
  const { products } = getCatalogForLocation(locationId);
  return products.find((p) => p.id === productId) ?? null;
}
