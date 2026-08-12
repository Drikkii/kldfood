import type { MenuProduct, VariantGroup, VariantOption } from "../types/catalog";
import { isDonerProduct, isLavashDogProduct, sizeOptionIconKey } from "../utils/product-size";
import { DonerSizeIcon } from "./DonerSizeIcon";
import { LavashSizeIcon } from "./LavashSizeIcon";
import { ShawarmaSizeIcon } from "./ShawarmaSizeIcon";

type ProductSizePickerProps = {
  group: VariantGroup;
  product: MenuProduct;
  selectedOptionId: string;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
};

export function ProductSizePicker({
  group,
  product,
  selectedOptionId,
  onSelect,
  disabled = false,
}: ProductSizePickerProps) {
  return (
    <div className="product-size-picker" role="group" aria-label={group.name}>
      {group.options.map((option) => (
        <SizeOptionButton
          key={option.id}
          product={product}
          option={option}
          selected={option.id === selectedOptionId}
          disabled={disabled || option.stopped}
          onSelect={() => onSelect(option.id)}
        />
      ))}
    </div>
  );
}

type SizeOptionButtonProps = {
  product: MenuProduct;
  option: VariantOption;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
};

function SizeOptionButton({ product, option, selected, disabled, onSelect }: SizeOptionButtonProps) {
  const iconKey = sizeOptionIconKey(option);
  const SizeIcon = isLavashDogProduct(product)
    ? LavashSizeIcon
    : isDonerProduct(product)
      ? DonerSizeIcon
      : ShawarmaSizeIcon;

  return (
    <button
      type="button"
      className={`product-size-picker__btn${selected ? " is-selected" : ""}`}
      aria-label={option.name}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
    >
      <SizeIcon size={iconKey} selected={selected} />
    </button>
  );
}
