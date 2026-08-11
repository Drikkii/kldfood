/** Какие блоки показывать в центре главной (не 1:1 с API-категориями) */
export type HomeMenuSectionConfig = {
  id: string;
  title: string;
  categoryIds: string[];
};

export const HOME_MENU_SECTIONS: HomeMenuSectionConfig[] = [
  { id: "cat-shawarma", title: "Шаурма", categoryIds: ["cat-shawarma"] },
  { id: "cat-doner", title: "Денер", categoryIds: ["cat-doner"] },
  { id: "cat-potato", title: "Картошка", categoryIds: ["cat-potato"] },
  { id: "cat-sauces", title: "Соусы", categoryIds: ["cat-sauces"] },
  {
    id: "cat-drinks",
    title: "Напитки",
    categoryIds: ["cat-drinks-cold", "cat-drinks-hot"],
  },
];
