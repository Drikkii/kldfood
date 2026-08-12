import { CartPanelContent } from "./CartPanelContent";

export function StickyCart() {
  return (
    <div className="sticky-cart-shell">
      <aside className="sticky-cart" aria-label="Корзина">
        <CartPanelContent />
      </aside>
    </div>
  );
}
