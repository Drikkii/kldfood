import { useCallback, useEffect, useMemo, useState } from "react";
import { CategoryTiles } from "../components/CategoryTiles";
import { HomeMenuSection } from "../components/HomeMenuSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { MobileCart } from "../components/MobileCart";
import { StickyCart } from "../components/StickyCart";
import { useSession } from "../context/SessionContext";
import { HOME_MENU_SECTIONS } from "../data/home-menu-sections";
import type { MenuProduct } from "../types/catalog";
import { loadMenu } from "../utils/load-menu";
import { productToCartLine } from "../utils/product-to-cart-line";

function getScrollOffset() {
  const isMobileCatalog = window.matchMedia("(max-width: 1023px)").matches;
  if (isMobileCatalog) {
    const categories = document.querySelector(".home-catalog__categories");
    return categories ? categories.getBoundingClientRect().height + 8 : 72;
  }
  return 64;
}

function scrollToCategory(categoryId: string) {
  const el = document.getElementById(`category-${categoryId}`);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - getScrollOffset();
  window.scrollTo({ top, behavior: "smooth" });
}

export function HomePage() {
  const { location, tryAddToCart } = useSession();
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenu(location?.id ?? null)
      .then((data) => {
        setProducts(data.products);
        setError(null);
      })
      .catch((e) => setError(String(e.message)));
  }, [location?.id]);

  const productsByCategory = useMemo(() => {
    const map = new Map<string, MenuProduct[]>();
    for (const product of products) {
      const list = map.get(product.categoryId) ?? [];
      list.push(product);
      map.set(product.categoryId, list);
    }
    return map;
  }, [products]);

  const homeSections = useMemo(
    () =>
      HOME_MENU_SECTIONS.map((section) => ({
        ...section,
        products: section.categoryIds.flatMap((id) => productsByCategory.get(id) ?? []),
      })).filter((section) => section.products.length > 0),
    [productsByCategory],
  );

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash.startsWith("category-")) return;
    const categoryId = hash.slice("category-".length);
    window.requestAnimationFrame(() => scrollToCategory(categoryId));
  }, [homeSections]);

  const onCategorySelect = useCallback((categoryId: string) => {
    window.history.replaceState(null, "", `#category-${categoryId}`);
    scrollToCategory(categoryId);
  }, []);

  const onProductSelect = useCallback(
    (product: MenuProduct) => {
      tryAddToCart(productToCartLine(product));
    },
    [tryAddToCart],
  );

  return (
    <>
      <div className="home-catalog">
        <aside className="home-catalog__categories home-catalog__rail">
          <CategoryTiles productsByCategory={productsByCategory} onSelect={onCategorySelect} />
        </aside>

        <div className="home-catalog__menu">
          {error ? <p role="alert">{error}</p> : null}

          {homeSections.map((section) => (
            <HomeMenuSection
              key={section.id}
              sectionId={section.id}
              title={section.title}
              products={section.products}
              onProductSelect={onProductSelect}
            />
          ))}
        </div>

        <aside className="home-catalog__cart home-catalog__rail">
          <StickyCart />
        </aside>
      </div>

      <ReviewsSection />

      <MobileCart />
    </>
  );
}
