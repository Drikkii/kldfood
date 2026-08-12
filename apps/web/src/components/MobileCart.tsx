import { useMemo, useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { useSession } from "../context/SessionContext";

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14h9.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49a1 1 0 00-.87-1.48H5.21L4.27 2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.16l1.1-1z"
      />
    </svg>
  );
}

export function MobileCart() {
  const { cart } = useSession();
  const [open, setOpen] = useState(false);

  const itemCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );

  return (
    <>
      <button
        type="button"
        className="mobile-cart-fab"
        aria-label={itemCount > 0 ? `Корзина, ${itemCount} товаров` : "Корзина"}
        onClick={() => setOpen(true)}
      >
        <IconCart />
        {itemCount > 0 ? (
          <span className="mobile-cart-fab__badge" aria-hidden="true">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        ) : null}
      </button>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
