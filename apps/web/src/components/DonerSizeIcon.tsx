import { DONER_ICON_URL } from "../data/brand-assets";
import type { SizeIconKey } from "../types/catalog";

type DonerSizeIconProps = {
  size: SizeIconKey;
  className?: string;
};

/** Иконка денера из public/images/dener-png.png — цвет через currentColor */
export function DonerSizeIcon({ size, className = "" }: DonerSizeIconProps) {
  return (
    <span
      className={`doner-size-icon${className ? ` ${className}` : ""}`}
      data-size={size}
      style={{
        WebkitMaskImage: `url(${DONER_ICON_URL})`,
        maskImage: `url(${DONER_ICON_URL})`,
      }}
      aria-hidden="true"
    />
  );
}
