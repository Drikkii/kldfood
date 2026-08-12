import type { MenuProduct, SizeIconKey, VariantGroup, VariantOption } from "../types/catalog";

export type ProductSelection = { groupId: string; optionId: string };

const SIZE_ICON_BY_OPTION_ID: Record<string, SizeIconKey> = {
  mini: "mini",
  standard: "standard",
  mega: "mega",
};

export function isSizeVariantGroup(group: VariantGroup): boolean {
  return group.kind === "size" || group.id === "size";
}

const SIZE_CATEGORY_IDS = new Set(["cat-shawarma", "cat-doner", "cat-lavash-dogs"]);
const DONER_CATEGORY_ID = "cat-doner";
const LAVASH_DOGS_CATEGORY_ID = "cat-lavash-dogs";

export function isDonerProduct(product: MenuProduct): boolean {
  return product.categoryId === DONER_CATEGORY_ID;
}

export function isLavashDogProduct(product: MenuProduct): boolean {
  return product.categoryId === LAVASH_DOGS_CATEGORY_ID;
}

export function isSizeCategoryProduct(product: MenuProduct): boolean {
  return SIZE_CATEGORY_IDS.has(product.categoryId);
}

function trimSizeGroupForCategory(group: VariantGroup, product: MenuProduct): VariantGroup {
  if (!isSizeVariantGroup(group)) return group;
  let options = group.options;
  if (isDonerProduct(product)) {
    options = options.filter((o) => o.id !== "mega");
  }
  if (isLavashDogProduct(product)) {
    options = normalizeLavashSizeOptions(options);
  }
  return { ...group, kind: "size" as const, options };
}

function normalizeLavashSizeOptions(options: VariantOption[]): VariantOption[] {
  const hasStandardMega = options.some((o) => o.id === "standard" || o.id === "mega");
  if (!hasStandardMega) {
    const one = options.find((o) => o.id === "mini");
    const two = options.find((o) => o.id === "standard");
    if (one || two) {
      const normalized: VariantOption[] = [];
      if (one) {
        normalized.push({
          ...one,
          id: "standard",
          name: "1 сосиска",
          iconKey: "standard",
          isDefault: true,
        });
      }
      if (two) {
        normalized.push({
          ...two,
          id: "mega",
          name: "2 сосиски",
          iconKey: "mega",
          isDefault: false,
        });
      }
      return normalized;
    }
  }

  return options
    .filter((o) => o.id === "standard" || o.id === "mega")
    .map((o) => ({
      ...o,
      name: o.id === "standard" ? "1 сосиска" : "2 сосиски",
      iconKey: o.id === "standard" ? ("standard" as const) : ("mega" as const),
      isDefault: o.id === "standard",
    }));
}

export function getSizeVariantGroup(product: MenuProduct): VariantGroup | null {
  const group = product.variantGroups?.find(isSizeVariantGroup) ?? null;
  if (!group) return null;
  return trimSizeGroupForCategory(group, product);
}

/** Гарантирует размеры: шаурма mini/standard/mega, денер mini/standard, лаваш-доги standard/mega. */
export function ensureProductSizeVariants(product: MenuProduct): MenuProduct {
  if (!isSizeCategoryProduct(product)) return product;

  const existing = getSizeVariantGroup(product);
  const minOptions = isDonerProduct(product) || isLavashDogProduct(product) ? 2 : 3;

  if (existing && existing.options.length >= minOptions) {
    return {
      ...product,
      variantGroups: (product.variantGroups ?? []).map((group) =>
        trimSizeGroupForCategory(group, product),
      ),
    };
  }

  const basePrice = product.priceFrom ?? product.basePrice;
  if (basePrice == null) return product;

  const baseWeightGrams = product.weightGrams ?? 370;
  const sizeGroup = buildLavashAwareSizeGroup(product, basePrice, baseWeightGrams);
  const otherGroups = (product.variantGroups ?? []).filter((g) => !isSizeVariantGroup(g));

  return {
    ...product,
    variantGroups: [...otherGroups, sizeGroup],
  };
}

export function ensureMenuProductSizes(products: MenuProduct[]): MenuProduct[] {
  return products.map(ensureProductSizeVariants);
}

export function productHasSizePicker(product: MenuProduct): boolean {
  if (!isSizeCategoryProduct(product)) {
    const group = getSizeVariantGroup(product);
    return (group?.options.length ?? 0) > 1;
  }
  return getSizeVariantGroup(product) != null;
}

export function sizeOptionIconKey(option: VariantOption): SizeIconKey {
  if (option.iconKey) return option.iconKey;
  return SIZE_ICON_BY_OPTION_ID[option.id] ?? "standard";
}

function defaultSizeOption(group: VariantGroup, _product?: MenuProduct): VariantOption | undefined {
  return (
    group.options.find((o) => o.id === "standard") ??
    group.options.find((o) => o.isDefault) ??
    group.options[Math.floor(group.options.length / 2)] ??
    group.options[0]
  );
}

export function defaultSizeOptionId(product: MenuProduct): string | null {
  const group = getSizeVariantGroup(product);
  if (!group) return null;
  return defaultSizeOption(group, product)?.id ?? null;
}

export function buildProductSelections(
  product: MenuProduct,
  sizeOptionId?: string | null,
): ProductSelection[] {
  const groups = product.variantGroups ?? [];
  return groups
    .map((group) => {
      if (isSizeVariantGroup(group)) {
        const optionId =
          sizeOptionId ??
          defaultSizeOption(group, product)?.id ??
          "";
        return { groupId: group.id, optionId };
      }
      const optionId =
        group.options.find((o) => o.isDefault)?.id ?? group.options[0]?.id ?? "";
      return { groupId: group.id, optionId };
    })
    .filter((s) => s.optionId);
}

export function getSelectedOption(
  product: MenuProduct,
  groupId: string,
  selections: ProductSelection[],
): VariantOption | null {
  const group = product.variantGroups?.find((g) => g.id === groupId);
  if (!group) return null;
  const picked = selections.find((s) => s.groupId === groupId)?.optionId;
  const fallbackId = isSizeVariantGroup(group)
    ? defaultSizeOption(group, product)?.id
    : group.options.find((o) => o.isDefault)?.id ?? group.options[0]?.id;
  const optionId = picked ?? fallbackId;
  return group.options.find((o) => o.id === optionId) ?? null;
}

const SIZE_CART_LABELS: Record<string, string> = {
  mini: "Мини",
  standard: "Стандарт",
  mega: "Мега",
};

export function sizeVariantCartLabel(option: VariantOption): string {
  if (option.name) return option.name;
  if (SIZE_CART_LABELS[option.id]) return SIZE_CART_LABELS[option.id];
  if (option.iconKey) return option.iconKey;
  return option.id;
}

export function getSelectedSizeOption(
  product: MenuProduct,
  selections: ProductSelection[],
): VariantOption | null {
  const group = getSizeVariantGroup(product);
  if (!group) return null;
  return getSelectedOption(product, group.id, selections);
}

/** Admin helper: mini + фиксированные шаги цены/веса */
export function buildSizeVariantGroup(input: {
  basePrice: number;
  baseWeightGrams: number;
  priceStepRub?: number;
  weightStepGrams?: number;
  includeMega?: boolean;
}): VariantGroup {
  const priceStep = input.priceStepRub ?? 30;
  const weightStep = input.weightStepGrams ?? 30;
  const miniWeight = input.baseWeightGrams;
  const includeMega = input.includeMega !== false;

  const options: VariantOption[] = [
    {
      id: "mini",
      name: "Мини",
      iconKey: "mini",
      price: input.basePrice,
      weightGrams: miniWeight,
      priceDelta: 0,
      weightDelta: 0,
    },
    {
      id: "standard",
      name: "Стандарт",
      iconKey: "standard",
      price: input.basePrice + priceStep,
      weightGrams: miniWeight + weightStep,
      priceDelta: priceStep,
      weightDelta: weightStep,
      isDefault: true,
    },
  ];

  if (includeMega) {
    options.push({
      id: "mega",
      name: "Мега",
      iconKey: "mega",
      price: input.basePrice + priceStep * 2,
      weightGrams: miniWeight + weightStep * 2,
      priceDelta: priceStep * 2,
      weightDelta: weightStep * 2,
    });
  }

  return {
    id: "size",
    name: "Размер",
    kind: "size",
    required: true,
    options,
  };
}

function buildLavashAwareSizeGroup(
  product: MenuProduct,
  basePrice: number,
  baseWeightGrams: number,
): VariantGroup {
  if (!isLavashDogProduct(product)) {
    return buildSizeVariantGroup({
      basePrice,
      baseWeightGrams,
      includeMega: !isDonerProduct(product),
    });
  }

  const priceStep = 30;
  const weightStep = 30;

  return {
    id: "size",
    name: "Размер",
    kind: "size",
    required: true,
    options: [
      {
        id: "standard",
        name: "1 сосиска",
        iconKey: "standard",
        price: basePrice,
        weightGrams: baseWeightGrams,
        priceDelta: 0,
        weightDelta: 0,
        isDefault: true,
      },
      {
        id: "mega",
        name: "2 сосиски",
        iconKey: "mega",
        price: basePrice + priceStep,
        weightGrams: baseWeightGrams + weightStep,
        priceDelta: priceStep,
        weightDelta: weightStep,
      },
    ],
  };
}
