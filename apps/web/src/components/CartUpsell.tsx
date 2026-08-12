import { useEffect, useMemo, useState } from "react";
import { CART_UPSELL_SECTIONS } from "../data/cart-upsell";
import { productImageUrl } from "../data/placeholder-images";
import { useSession } from "../context/SessionContext";
import type { MenuProduct } from "../types/catalog";
import { loadMenu } from "../utils/load-menu";
import { productPriceLabel } from "../utils/menu-pricing";
import { productToCartLine } from "../utils/product-to-cart-line";

type CartUpsellProps = {
  variant?: "cart" | "checkout";
  heading?: string;
};

type CartUpsellCardProps = {
  product: MenuProduct;
  cartQuantity: number;
  compact?: boolean;
  onAdd: (product: MenuProduct) => void;
};

function CartUpsellCard({ product, cartQuantity, compact, onAdd }: CartUpsellCardProps) {
  const priceLabel = productPriceLabel(product);

  return (
    <article className={`cart-upsell-card${compact ? " cart-upsell-card--compact" : ""}`}>
      <div
        className="cart-upsell-card__image"
        style={{
          backgroundImage: `url(${productImageUrl(product.id, product.categoryId, product.imageUrl)})`,
        }}
        aria-hidden="true"
      />
      <div className="cart-upsell-card__body">
        <h4 className="cart-upsell-card__name">{product.name}</h4>
        <div className="cart-upsell-card__foot">
          <span className="cart-upsell-card__price">{priceLabel}</span>
          <button
            type="button"
            className={`cart-upsell-card__btn${cartQuantity > 0 ? " cart-upsell-card__btn--plus" : ""}`}
            disabled={product.stopped}
            onClick={() => onAdd(product)}
            aria-label={cartQuantity > 0 ? "Добавить ещё" : "Выбрать"}
          >
            {cartQuantity > 0 ? (
              <span className="cart-upsell-card__plus" aria-hidden="true" />
            ) : (
              "Выбрать"
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export function CartUpsell({ variant = "cart", heading }: CartUpsellProps) {
  const { location, cart, addToCart } = useSession();
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const compact = variant === "checkout";
  const title = heading ?? (variant === "checkout" ? "Рекомендуем попробовать" : "Ничего не забыл?");

  useEffect(() => {
    loadMenu(location?.id ?? null).then((data) => setProducts(data.products));
  }, [location?.id]);

  const cartQtyByProduct = useMemo(() => {
    const map = new Map<string, number>();
    for (const line of cart) {
      map.set(line.productId, (map.get(line.productId) ?? 0) + line.quantity);
    }
    return map;
  }, [cart]);

  const sections = useMemo(
    () =>
      CART_UPSELL_SECTIONS.map((section) => ({
        ...section,
        products: section.categoryIds.flatMap((categoryId) =>
          products.filter((product) => product.categoryId === categoryId),
        ),
      })).filter((section) => section.products.length > 0),
    [products],
  );

  if (sections.length === 0) return null;

  function onAdd(product: MenuProduct) {
    addToCart(productToCartLine(product));
  }

  return (
    <section
      className={`cart-upsell${compact ? " cart-upsell--checkout" : ""}`}
      aria-label="Добавить к заказу"
    >
      <h3 className="cart-upsell__heading">{title}</h3>
      {sections.map((section) => (
        <div key={section.id} className="cart-upsell__section">
          <h4 className="cart-upsell__section-title">{section.title}</h4>
          <div
            className={
              compact ? "cart-upsell__grid cart-upsell__grid--checkout" : "cart-upsell__scroll-row"
            }
            aria-label={section.title}
          >
            {section.products.map((product) => (
              <CartUpsellCard
                key={product.id}
                product={product}
                cartQuantity={cartQtyByProduct.get(product.id) ?? 0}
                compact={compact}
                onAdd={onAdd}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
