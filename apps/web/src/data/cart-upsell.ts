/** Допродажи в корзине — картошка, соусы, напитки */
export type CartUpsellSectionConfig = {
  id: string;
  title: string;
  categoryIds: string[];
};

export const CART_UPSELL_SECTIONS: CartUpsellSectionConfig[] = [
  { id: "cat-potato", title: "Картошка", categoryIds: ["cat-potato"] },
  { id: "cat-sauces", title: "Соусы", categoryIds: ["cat-sauces"] },
  {
    id: "cat-drinks",
    title: "Напитки",
    categoryIds: ["cat-drinks-cold", "cat-drinks-hot"],
  },
];
