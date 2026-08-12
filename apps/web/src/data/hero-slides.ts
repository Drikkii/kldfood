import type { HeroSlide } from "../types/hero-slide";

const base = import.meta.env.BASE_URL;

const BRAND = {
  recruitment: `${base}images/brand/brand-recruitment.jpg`,
  menu1: `${base}images/brand/brand-menu-1.jpg`,
  menu2: `${base}images/brand/brand-menu-2.jpg`,
} as const;

/** Слайды в стиле бренда FIRE FOOD */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Шаурма FIRE FOOD",
    subtitle: "Курица · Говядина · Mix · Vegan",
    imageUrl: BRAND.menu2,
    accent: "#ffcc00",
    link: "/",
  },
  {
    id: "slide-2",
    title: "Курица и картофель",
    subtitle: "mini · standart · mega",
    imageUrl: BRAND.menu1,
    accent: "#e60000",
    link: "/",
  },
  {
    id: "slide-3",
    title: "Горячее — как на огне",
    subtitle: "Доставка и самовывоз по Калининграду",
    imageUrl: BRAND.recruitment,
    accent: "#ffd700",
    link: "/",
  },
];
