/** Филлер-фото — позже замените на файлы из public/images/ или админки */

export const PLACEHOLDER = {
  shawarma: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  grill: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  spread: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  fries: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800",
  potato: "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800",
  sauce: "https://images.pexels.com/photos/2233348/pexels-photo-2233348.jpeg?auto=compress&cs=tinysrgb&w=800",
  box: "https://images.unsplash.com/photo-1608039256273-f397afbd6924?auto=format&fit=crop&w=800&q=80",
  drinkCold: "https://images.pexels.com/photos/5946076/pexels-photo-5946076.jpeg?auto=compress&cs=tinysrgb&w=800",
  drinkCola: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80",
  drinkJuice: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=800",
  drinkHot: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
  tea: "https://images.pexels.com/photos/1415752/pexels-photo-1415752.jpeg?auto=compress&cs=tinysrgb&w=800",
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  builder: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800",
} as const;

export const CATEGORY_IMAGES: Record<string, string> = {
  "cat-shawarma": PLACEHOLDER.shawarma,
  "cat-doner": PLACEHOLDER.burger,
  "cat-potato": PLACEHOLDER.fries,
  "cat-sauces": PLACEHOLDER.sauce,
  "cat-chickenbox": PLACEHOLDER.box,
  "cat-builder": PLACEHOLDER.builder,
  "cat-drinks": PLACEHOLDER.drinkCold,
  "cat-drinks-cold": PLACEHOLDER.drinkCold,
  "cat-spoons": PLACEHOLDER.box,
  "cat-napkins": PLACEHOLDER.spread,
  "cat-drinks-hot": PLACEHOLDER.drinkHot,
};

export const PRODUCT_IMAGES: Record<string, string> = {
  "shawarma-chicken": PLACEHOLDER.shawarma,
  "shawarma-beef": PLACEHOLDER.grill,
  "doner-chicken": PLACEHOLDER.burger,
  "doner-beef": PLACEHOLDER.pizza,
  "chickenbox-mix": PLACEHOLDER.box,
  "chickenbox-chicken": PLACEHOLDER.grill,
  "fries-classic": PLACEHOLDER.fries,
  "potato-country": PLACEHOLDER.potato,
  "sauce-classic": PLACEHOLDER.sauce,
  "sauce-garlic": PLACEHOLDER.sauce,
  "builder-shawarma": PLACEHOLDER.builder,
  "drink-cola": PLACEHOLDER.drinkCola,
  "drink-juice": PLACEHOLDER.drinkJuice,
  "drink-tea": PLACEHOLDER.tea,
  "drink-coffee": PLACEHOLDER.drinkHot,
  "shawarma-mix": PLACEHOLDER.shawarma,
  "shawarma-spicy": PLACEHOLDER.grill,
  "shawarma-cheese": PLACEHOLDER.spread,
  "shawarma-veggie": PLACEHOLDER.shawarma,
  "doner-mix": PLACEHOLDER.burger,
  "doner-spicy": PLACEHOLDER.grill,
  "doner-cheese": PLACEHOLDER.pizza,
  "doner-lamb": PLACEHOLDER.burger,
  "potato-wedges": PLACEHOLDER.fries,
  "potato-baked": PLACEHOLDER.potato,
  "potato-cheese": PLACEHOLDER.fries,
  "potato-curly": PLACEHOLDER.potato,
  "sauce-ketchup": PLACEHOLDER.sauce,
  "sauce-mustard": PLACEHOLDER.sauce,
  "sauce-spicy": PLACEHOLDER.sauce,
  "sauce-bbq": PLACEHOLDER.sauce,
  "drink-lemonade": PLACEHOLDER.drinkJuice,
  "drink-cappuccino": PLACEHOLDER.drinkHot,
};

export const HERO_SLIDE_IMAGES = [
  PLACEHOLDER.burger,
  PLACEHOLDER.grill,
  PLACEHOLDER.spread,
  PLACEHOLDER.shawarma,
  PLACEHOLDER.restaurant,
] as const;

export function productImageUrl(
  productId: string,
  categoryId?: string,
  imageUrl?: string | null,
): string {
  if (imageUrl) return imageUrl;
  if (PRODUCT_IMAGES[productId]) return PRODUCT_IMAGES[productId];
  if (categoryId && CATEGORY_IMAGES[categoryId]) return CATEGORY_IMAGES[categoryId];
  return PLACEHOLDER.spread;
}

export function categoryImageUrl(imageKey: string, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl;
  return CATEGORY_IMAGES[imageKey] ?? PLACEHOLDER.spread;
}

export function cartLineImageUrl(line: {
  productId: string;
  categoryId?: string;
  imageUrl?: string;
}): string {
  return productImageUrl(line.productId, line.categoryId, line.imageUrl);
}
