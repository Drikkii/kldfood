/** Блокирует скролл страницы без сдвига контента (скроллбар / слайдер). */
export function lockPageScroll(): () => void {
  const html = document.documentElement;
  const prevOverflow = html.style.overflow;

  // scrollbar-gutter: stable на html уже резервирует место под скроллбар —
  // padding-right на body только сдвигает контент (слайдер, шапку) вправо.
  html.style.overflow = "hidden";

  return () => {
    html.style.overflow = prevOverflow;
  };
}
