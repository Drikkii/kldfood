import { useEffect, useMemo, useRef, useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { useSession } from "../context/SessionContext";

const MOBILE_CART_MQ = "(max-width: 1023px)";
/** Зазор между низом кнопки и красной линией футера */
const FOOTER_CLEARANCE_PX = 20;
const DEFAULT_BOTTOM_REM = 1.15;

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

function readDefaultBottomPx(): number {
  return DEFAULT_BOTTOM_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function MobileCart() {
  const { cart } = useSession();
  const [open, setOpen] = useState(false);
  const [fabBottomPx, setFabBottomPx] = useState<number | null>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  const itemCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_CART_MQ);

    function updateFabBottom() {
      if (!media.matches) {
        setFabBottomPx(null);
        return;
      }

      const footer = document.querySelector(".site-footer");
      if (!footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const defaultBottom = readDefaultBottomPx();

      // bottom >= vh - footerTop + clearance → низ кнопки выше красной линии футера
      const liftedBottom = viewportHeight - footerTop + FOOTER_CLEARANCE_PX;

      setFabBottomPx(Math.max(defaultBottom, liftedBottom));
    }

    updateFabBottom();

    window.addEventListener("scroll", updateFabBottom, { passive: true });
    window.addEventListener("resize", updateFabBottom);
    media.addEventListener("change", updateFabBottom);

    return () => {
      window.removeEventListener("scroll", updateFabBottom);
      window.removeEventListener("resize", updateFabBottom);
      media.removeEventListener("change", updateFabBottom);
    };
  }, []);

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        className="mobile-cart-fab"
        aria-label={itemCount > 0 ? `Корзина, ${itemCount} товаров` : "Корзина"}
        onClick={() => setOpen(true)}
        style={fabBottomPx != null ? { bottom: `${fabBottomPx}px` } : undefined}
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
