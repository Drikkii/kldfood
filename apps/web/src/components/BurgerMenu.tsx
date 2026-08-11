import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BrandLogo } from "./BrandLogo";
import { lockPageScroll } from "../utils/lock-page-scroll";

const LINKS = [
  { to: "/promotions", label: "Акции" },
  { to: "/career", label: "Карьера" },
  { to: "/franchise", label: "Франшиза" },
  { to: "/about", label: "О компании" },
] as const;

type BurgerMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function BurgerMenu({ open, onClose }: BurgerMenuProps) {
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
    <div className="burger-root" role="presentation">
      <button type="button" className="burger-backdrop" aria-label="Закрыть меню" onClick={onClose} />
      <aside className="burger-panel" aria-label="Навигация">
        <div className="burger-panel__head">
          <BrandLogo compact />
          <button type="button" className="burger-panel__close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>
        <nav className="burger-panel__nav">
          {LINKS.map((item) => (
            <Link key={item.to} to={item.to} className="burger-panel__link" onClick={onClose}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
