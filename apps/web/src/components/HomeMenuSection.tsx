import type { MenuProduct } from "../types/catalog";
import { productImageUrl } from "../data/placeholder-images";
import { productDisplayPrice } from "../utils/menu-pricing";

type HomeMenuSectionProps = {
  sectionId: string;
  title: string;
  products: MenuProduct[];
  onProductSelect: (product: MenuProduct) => void;
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
        {products.map((product) => {
          const price = productDisplayPrice(product);
          const priceLabel =
            product.priceFrom != null || (product.variantGroups?.length ?? 0) > 0
              ? `от ${price} ₽`
              : `${price} ₽`;

          return (
            <article key={product.id} className="home-product-card">
              <div
                className="home-product-card__image"
                style={{
                  backgroundImage: `url(${productImageUrl(product.id, product.categoryId, product.imageUrl)})`,
                }}
                aria-hidden="true"
              />
              <div className="home-product-card__body">
                <h3 className="home-product-card__name">{product.name}</h3>
                {product.weightGrams != null ? (
                  <p className="home-product-card__meta">{product.weightGrams} г</p>
                ) : null}
                {product.description ? (
                  <p className="home-product-card__desc">{product.description}</p>
                ) : null}
                <div className="home-product-card__foot">
                  <span className="home-product-card__price">{priceLabel}</span>
                  <button
                    type="button"
                    className="home-product-card__btn"
                    disabled={product.stopped}
                    onClick={() => onProductSelect(product)}
                  >
                    Выбрать
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
