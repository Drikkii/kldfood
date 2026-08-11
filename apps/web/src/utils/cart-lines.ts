import type { CartLine } from "../types/catalog";

function normalizeLine(line: CartLine): CartLine {
  return {
    ...line,
    selections: line.selections ?? [],
    modifiers: line.modifiers ?? [],
  };
}

export function cartLinesMatch(a: CartLine, b: CartLine): boolean {
  return (
    a.productId === b.productId &&
    a.unitPrice === b.unitPrice &&
    JSON.stringify(a.selections) === JSON.stringify(b.selections) &&
    JSON.stringify(a.modifiers) === JSON.stringify(b.modifiers) &&
    (a.variantLabel ?? "") === (b.variantLabel ?? "") &&
    (a.extrasLabel ?? "") === (b.extrasLabel ?? "")
  );
}

export function mergeCartLine(cart: CartLine[], line: CartLine): CartLine[] {
  const next = cart.map(normalizeLine);
  const incoming = normalizeLine(line);
  const index = next.findIndex((item) => cartLinesMatch(item, incoming));

  if (index >= 0) {
    return next.map((item, i) =>
      i === index ? { ...item, quantity: item.quantity + incoming.quantity } : item,
    );
  }

  return [...next, incoming];
}

export function normalizeCartLines(cart: CartLine[] | undefined): CartLine[] {
  return (cart ?? []).map(normalizeLine);
}
