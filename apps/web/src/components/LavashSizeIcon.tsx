import { SOSISKA_2_ICON_URL, SOSISKA_ICON_URL } from "../data/brand-assets";
import type { SizeIconKey } from "../types/catalog";

type LavashSizeIconProps = {
  size: SizeIconKey;
  selected?: boolean;
  className?: string;
};

/** 1 сосиска = standard, 2 сосиски = mega */
const LAVASH_ICON_URL: Record<"standard" | "mega", string> = {
  standard: SOSISKA_ICON_URL,
  mega: SOSISKA_2_ICON_URL,
};

function lavashIconKey(size: SizeIconKey): "standard" | "mega" {
  return size === "mega" ? "mega" : "standard";
}

/** Иконки лаваш-догов — mask из PNG (белые линии на чёрном), цвет через background */
export function LavashSizeIcon({ size, selected = false, className = "" }: LavashSizeIconProps) {
  const iconSize = lavashIconKey(size);
  const url = LAVASH_ICON_URL[iconSize];

  return (
    <span
      className={`lavash-size-icon${selected ? " is-selected" : ""}${className ? ` ${className}` : ""}`}
      data-size={iconSize}
      style={{
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
      }}
      aria-hidden="true"
    />
  );
}
