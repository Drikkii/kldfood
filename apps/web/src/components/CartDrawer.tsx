import { useEffect } from "react";
import { CartPanelContent } from "./CartPanelContent";
import { useSession } from "../context/SessionContext";
import { lockPageScroll } from "../utils/lock-page-scroll";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, clearCart } = useSession();
  const isEmpty = cart.length === 0;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const unlock = lockPageScroll();
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="cart-drawer-root" role="presentation">
      <button type="button" className="cart-drawer-backdrop" aria-label="Закрыть корзину" onClick={onClose} />
      <aside className={`cart-drawer-panel${isEmpty ? " cart-drawer-panel--empty" : ""}`} aria-label="Корзина">
        <div className="cart-drawer-panel__head">
          {!isEmpty ? (
            <>
              <h2 className="cart-drawer-panel__title">Корзина</h2>
              <div className="cart-drawer-panel__head-actions">
                <button type="button" className="sticky-cart__clear" onClick={clearCart}>
                  Очистить
                </button>
                <button type="button" className="cart-drawer-panel__close" onClick={onClose} aria-label="Закрыть">
                  ×
                </button>
              </div>
            </>
          ) : (
            <>
              <span aria-hidden="true" />
              <button type="button" className="cart-drawer-panel__close" onClick={onClose} aria-label="Закрыть">
                ×
              </button>
            </>
          )}
        </div>
        <div className="cart-drawer-panel__body">
          <CartPanelContent onNavigate={onClose} showHeading={false} />
        </div>
      </aside>
    </div>
  );
}
