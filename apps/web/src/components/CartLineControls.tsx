import { useSession } from "../context/SessionContext";

type CartLineControlsProps = {
  index: number;
  quantity: number;
  compact?: boolean;
};

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
        Удалить
      </button>
    </div>
  );
}
