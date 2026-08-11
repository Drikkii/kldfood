/**
 * Серверная проверка корзины: товары, варианты, допы, цены, стоп-лист.
 * Сумму считает только backend — клиентские цены игнорируются.
 */

import { getProductSnapshot } from "./catalog.js";
import { resolveLineModifiers } from "./cart-modifiers.js";

/**
 * @typedef {{ productId: string, quantity: number, selections?: { groupId: string, optionId: string }[], modifiers?: { modifierId: string, quantity: number }[] }} CartLineInput
 * @typedef {{ productId: string, name: string, quantity: number, unitPrice: number, lineTotal: number, selections: object[], modifiers: object[], rkeeperLines: { code: string, quantity: number, price: number }[] }} ValidatedLine
 */

/**
 * @param {string} locationId
 * @param {CartLineInput[]} rawItems
 */
export function validateAndPriceCart(locationId, rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { ok: false, error: "empty_cart" };
  }

  /** @type {ValidatedLine[]} */
  const lines = [];
  /** @type {unknown[]} */
  const details = [];

  for (let i = 0; i < rawItems.length; i++) {
    const item = rawItems[i];
    let lineInvalid = false;
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      details.push({ index: i, code: "invalid_quantity" });
      continue;
    }

    const product = getProductSnapshot(locationId, item.productId);
    if (!product) {
      details.push({ index: i, code: "product_not_found", productId: item.productId });
      continue;
    }
    if (product.stopped) {
      details.push({ index: i, code: "product_stop_list", productId: item.productId });
      continue;
    }

    const groups = product.variantGroups ?? [];
    const selectionsInput = Array.isArray(item.selections) ? item.selections : [];

    /** @type {object[]} */
    const resolvedSelections = [];
    let baseUnitPrice = product.basePrice ?? null;

    if (groups.length > 0) {
      for (const group of groups) {
        const picked = selectionsInput.find((s) => s.groupId === group.id);
        const optionId =
          picked?.optionId ?? group.options.find((o) => o.isDefault)?.id ?? group.options[0]?.id;

        const option = group.options.find((o) => o.id === optionId);
        if (!option) {
          details.push({ index: i, code: "invalid_variant", groupId: group.id });
          lineInvalid = true;
          break;
        }
        if (option.stopped) {
          details.push({ index: i, code: "variant_stop_list", optionId: option.id });
          lineInvalid = true;
          break;
        }

        resolvedSelections.push({
          groupId: group.id,
          groupName: group.name,
          optionId: option.id,
          optionName: option.name,
        });
        baseUnitPrice = option.price;
      }
    }

    if (lineInvalid) {
      continue;
    }

    if (baseUnitPrice == null) {
      if (product.priceFrom != null) {
        details.push({ index: i, code: "variant_required", productId: product.id });
      } else {
        details.push({ index: i, code: "price_unavailable", productId: product.id });
      }
      continue;
    }

    const modifiersInput = Array.isArray(item.modifiers) ? item.modifiers : [];
    const modResult = resolveLineModifiers(product, locationId, i, modifiersInput, details);
    if (!modResult.ok) {
      continue;
    }

    const selectedOption = resolvedSelections[resolvedSelections.length - 1];
    const optionSnapshot = groups
      .flatMap((g) => g.options)
      .find((o) => o.id === selectedOption?.optionId);
    const rkMainCode = optionSnapshot?.rkeeperCode ?? product.rkeeperCode ?? product.id;

    const unitPrice = baseUnitPrice + modResult.extrasPerUnit;
    const lineTotal = Math.round(unitPrice * quantity * 100) / 100;

    /** @type {{ code: string, quantity: number, price: number }[]} */
    const rkeeperLines = [
      { code: rkMainCode, quantity, price: baseUnitPrice },
    ];
    for (const extra of modResult.rkeeperExtras) {
      rkeeperLines.push({
        code: extra.code,
        quantity: quantity * extra.quantity,
        price: extra.price,
      });
    }

    lines.push({
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice,
      lineTotal,
      selections: resolvedSelections,
      modifiers: modResult.resolved,
      rkeeperLines,
    });
  }

  if (details.length > 0) {
    return { ok: false, error: "cart_validation_failed", details };
  }

  const amountRub = Math.round(lines.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
  if (amountRub <= 0) {
    return { ok: false, error: "invalid_amount" };
  }

  return { ok: true, lines, amountRub };
}
