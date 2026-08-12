import type { CartLine, MenuProduct } from "../types/catalog";
import { HomeProductCard } from "./HomeProductCard";

type HomeMenuSectionProps = {
  sectionId: string;
  title: string;
  products: MenuProduct[];
  onProductSelect: (line: CartLine) => void;
};

export function HomeMenuSection({
  sectionId,
  title,
  products,
  onProductSelect,
}: HomeMenuSectionProps) {
  return (
    <section
      id={`category-${sectionId}`}
      className="home-menu-section"
      aria-labelledby={`category-title-${sectionId}`}
    >
      <h2 id={`category-title-${sectionId}`} className="home-menu-section__title">
        {title}
      </h2>
      <div className="home-menu-section__grid">
        {products.map((product) => (
          <HomeProductCard key={product.id} product={product} onSelect={onProductSelect} />
        ))}
      </div>
    </section>
  );
}
