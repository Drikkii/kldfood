/**
 * Публичный ответ API — без кодов R-Keeper (фронт их не знает).
 * @param {object} product
 */
export function toPublicProduct(product) {
  const { rkeeperCode, variantGroups, modifierGroups, ...rest } = product;
  return {
    ...rest,
    variantGroups: variantGroups?.map((g) => ({
      id: g.id,
      name: g.name,
      required: g.required,
      options: g.options.map((o) => {
        const { rkeeperCode: _rk, stopped, ...opt } = o;
        return { ...opt, stopped: stopped ?? false };
      }),
    })),
    modifierGroups: modifierGroups?.map((g) => ({
      id: g.id,
      name: g.name,
      minPick: g.minPick ?? 0,
      maxPick: g.maxPick,
      modifiers: g.modifiers.map((m) => {
        const { rkeeperCode: _rk, stopped, ...mod } = m;
        return { ...mod, stopped: stopped ?? false };
      }),
    })),
  };
}
