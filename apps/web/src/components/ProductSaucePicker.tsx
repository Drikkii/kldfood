import type { VariantGroup } from "../types/catalog";

type ProductSaucePickerProps = {
  group: VariantGroup;
  selectedOptionId: string;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
};

export function ProductSaucePicker({
  group,
  selectedOptionId,
  onSelect,
  disabled = false,
}: ProductSaucePickerProps) {
  return (
    <div className="product-sauce-picker" role="group" aria-label={group.name}>
      {group.options.map((option) => {
        const selected = option.id === selectedOptionId;
        const showExtra =
          option.id === "cheese" && (option.priceDelta ?? option.price ?? 0) > 0;

        return (
          <button
            key={option.id}
            type="button"
            className={`product-sauce-picker__btn${selected ? " is-selected" : ""}`}
            aria-pressed={selected}
            disabled={disabled || option.stopped}
            onClick={() => onSelect(option.id)}
          >
            <span className="product-sauce-picker__label">{option.name}</span>
            {showExtra ? (
              <span className="product-sauce-picker__extra">
                +{option.priceDelta ?? option.price} ₽
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
