/** Плитки навигации слева — не 1:1 с разделами меню */
export type CategoryNavTile = {
  id: string;
  label: string;
  /** К какому блоку меню скроллить */
  targetCategoryId: string;
  /** Для цены «от» — из одной или нескольких категорий */
  priceCategoryIds: string[];
  imageKey: string;
};

export const CATEGORY_NAV_TILES: CategoryNavTile[] = [
  {
    id: "nav-shawarma",
    label: "Шаурма",
    targetCategoryId: "cat-shawarma",
    priceCategoryIds: ["cat-shawarma"],
    imageKey: "cat-shawarma",
  },
  {
    id: "nav-doner",
    label: "Денер",
    targetCategoryId: "cat-doner",
    priceCategoryIds: ["cat-doner"],
    imageKey: "cat-doner",
  },
  {
    id: "nav-lavash-dogs",
    label: "Лаваш-доги",
    targetCategoryId: "cat-lavash-dogs",
    priceCategoryIds: ["cat-lavash-dogs"],
    imageKey: "cat-lavash-dogs",
  },
  {
    id: "nav-potato",
    label: "Закуски",
    targetCategoryId: "cat-potato",
    priceCategoryIds: ["cat-potato"],
    imageKey: "cat-potato",
  },
  {
    id: "nav-sauces",
    label: "Соусы",
    targetCategoryId: "cat-sauces",
    priceCategoryIds: ["cat-sauces"],
    imageKey: "cat-sauces",
  },
  {
    id: "nav-drinks",
    label: "Напитки",
    targetCategoryId: "cat-drinks",
    priceCategoryIds: ["cat-drinks-cold", "cat-drinks-hot"],
    imageKey: "cat-drinks",
  },
];
