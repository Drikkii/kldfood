import { useSession } from "../context/SessionContext";

type CartLineControlsProps = {
  index: number;
  quantity: number;
  compact?: boolean;
};

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      />
    </svg>
  );
}

export function CartLineControls({ index, quantity, compact }: CartLineControlsProps) {
  const { changeCartLineQuantity, removeCartLine } = useSession();

  return (
    <div className={`cart-line-controls${compact ? " cart-line-controls--compact" : ""}`}>
      <div className="cart-line-controls__qty">
        <button
          type="button"
          className="cart-line-controls__btn cart-line-controls__btn--minus"
          aria-label="Уменьшить количество"
          onClick={() => changeCartLineQuantity(index, -1)}
        >
          <span
            className="cart-line-controls__icon cart-line-controls__icon--minus"
            aria-hidden="true"
          />
        </button>
        <span className="cart-line-controls__count">{quantity}</span>
        <button
          type="button"
          className="cart-line-controls__btn cart-line-controls__btn--plus"
          aria-label="Добавить ещё одну"
          onClick={() => changeCartLineQuantity(index, 1)}
        >
          <span
            className="cart-line-controls__icon cart-line-controls__icon--plus"
            aria-hidden="true"
          />
        </button>
      </div>
      <button
        type="button"
        className="cart-line-controls__remove"
        aria-label="Удалить из корзины"
        onClick={() => removeCartLine(index)}
      >
        <IconTrash />
      </button>
    </div>
  );
}
