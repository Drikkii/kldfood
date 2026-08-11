import type { Location } from "../types/catalog";

/** Филлер-точки Калининград — совпадают с API, для офлайна / GitHub Pages */
export const FALLBACK_LOCATIONS: Location[] = [
  {
    id: "kgd-leninsky",
    name: "FIRE FOOD · Ленинский",
    address: "ул. Ленинский проспект, 30",
    city: "Калининград",
    pickup: true,
    delivery: true,
    workHours: "10:00–23:00",
  },
  {
    id: "kgd-moscow",
    name: "FIRE FOOD · Московский",
    address: "пр-т Московский, 40",
    city: "Калининград",
    pickup: true,
    delivery: true,
    workHours: "10:00–23:00",
  },
  {
    id: "kgd-north",
    name: "FIRE FOOD · Северный",
    address: "ул. Северная, 12",
    city: "Калининград",
    pickup: true,
    delivery: false,
    workHours: "11:00–22:00",
  },
];
