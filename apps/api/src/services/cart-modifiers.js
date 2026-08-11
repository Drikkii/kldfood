/**
 * @param {object} product
 * @returns {Map<string, { mod: object, group: object }>}
 */
export function indexProductModifiers(product) {
  /** @type {Map<string, { mod: object, group: object }>} */
  const map = new Map();
  for (const group of product.modifierGroups ?? []) {
    for (const mod of group.modifiers ?? []) {
      map.set(mod.id, { mod, group });
    }
  }
  return map;
}

/**
 * @param {object} product
 * @param {string} locationId
 * @param {number} lineIndex
 * @param {{ modifierId: string, quantity: number }[]} modifiersInput
 * @param {unknown[]} details
 * @returns {{ ok: false } | { ok: true, resolved: object[], extrasPerUnit: number, rkeeperExtras: object[] }}
 */
export function resolveLineModifiers(product, locationId, lineIndex, modifiersInput, details) {
  const index = indexProductModifiers(product);
  const groups = product.modifierGroups ?? [];

  if (modifiersInput.length === 0 && groups.every((g) => (g.minPick ?? 0) === 0)) {
    return { ok: true, resolved: [], extrasPerUnit: 0, rkeeperExtras: [] };
  }

  /** @type {Map<string, number>} */
  const qtyByModifier = new Map();
  for (const row of modifiersInput) {
    const mq = Number(row.quantity);
    if (!Number.isInteger(mq) || mq < 1) {
      details.push({ index: lineIndex, code: "invalid_modifier_qty", modifierId: row.modifierId });
      return { ok: false };
    }

    const entry = index.get(row.modifierId);
    if (!entry) {
      details.push({ index: lineIndex, code: "invalid_modifier", modifierId: row.modifierId });
      return { ok: false };
    }

    const { mod, group } = entry;
    if (mod.stopped) {
      details.push({ index: lineIndex, code: "modifier_stop_list", modifierId: mod.id });
      return { ok: false };
    }

    const maxQ = mod.maxQuantity ?? 9;
    const prev = qtyByModifier.get(mod.id) ?? 0;
    const nextQ = prev + mq;
    if (nextQ > maxQ) {
      details.push({ index: lineIndex, code: "modifier_max_quantity", modifierId: mod.id, max: maxQ });
      return { ok: false };
    }
    qtyByModifier.set(mod.id, nextQ);
  }

  /** @type {Map<string, number>} */
  const picksByGroup = new Map();
  /** @type {object[]} */
  const resolved = [];
  /** @type {object[]} */
  const rkeeperExtras = [];
  let extrasPerUnit = 0;

  for (const [modifierId, qty] of qtyByModifier) {
    const { mod, group } = index.get(modifierId);
    picksByGroup.set(group.id, (picksByGroup.get(group.id) ?? 0) + qty);

    extrasPerUnit += mod.price * qty;
    resolved.push({
      modifierId: mod.id,
      name: mod.name,
      groupId: group.id,
      groupName: group.name,
      quantity: qty,
      unitPrice: mod.price,
      lineExtra: mod.price * qty,
    });
    rkeeperExtras.push({
      code: mod.rkeeperCode ?? mod.id,
      quantity: qty,
      price: mod.price,
    });
  }

  for (const group of groups) {
    const picked = picksByGroup.get(group.id) ?? 0;
    const minPick = group.minPick ?? 0;
    const maxPick = group.maxPick ?? 99;
    if (picked < minPick) {
      details.push({ index: lineIndex, code: "modifier_min_pick", groupId: group.id, min: minPick });
      return { ok: false };
    }
    if (picked > maxPick) {
      details.push({ index: lineIndex, code: "modifier_max_pick", groupId: group.id, max: maxPick });
      return { ok: false };
    }
  }

  return { ok: true, resolved, extrasPerUnit, rkeeperExtras };
}
