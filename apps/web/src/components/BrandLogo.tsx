import { BRAND_LOGO_URL } from "../data/brand-assets";

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
};

export function BrandLogo({ className = "", compact = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo${compact ? " brand-logo--compact" : ""}${className ? ` ${className}` : ""}`}>
      <img
        className="brand-logo__img"
        src={BRAND_LOGO_URL}
        alt=""
        width={compact ? 62 : 68}
        height={compact ? 62 : 68}
        decoding="async"
        aria-hidden="true"
      />
      <span className="brand-logo__text" aria-hidden="true">
        <span className="brand-logo__fire">FIRE</span>
        <span className="brand-logo__food">FOOD</span>
      </span>
    </span>
  );
}
