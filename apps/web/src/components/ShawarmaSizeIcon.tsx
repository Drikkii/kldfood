import { SHAWERMA_ICON_URL } from "../data/brand-assets";
import type { SizeIconKey } from "../types/catalog";

type ShawarmaSizeIconProps = {
  size: SizeIconKey;
  className?: string;
};

/** Иконка шаурмы из public/images/shawerma.png — цвет через currentColor */
export function ShawarmaSizeIcon({ size, className = "" }: ShawarmaSizeIconProps) {
  return (
    <span
      className={`shawerma-size-icon${className ? ` ${className}` : ""}`}
      data-size={size}
      style={{
        WebkitMaskImage: `url(${SHAWERMA_ICON_URL})`,
        maskImage: `url(${SHAWERMA_ICON_URL})`,
      }}
      aria-hidden="true"
    />
  );
}
