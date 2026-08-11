/** Баннер главной — позже управление из админки / API */
export type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  /** URL картинки; пока можно gradient через accent */
  imageUrl?: string;
  accent: string;
  link?: string;
};
