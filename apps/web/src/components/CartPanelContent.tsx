import { Link } from "react-router-dom";
import { CartLineControls } from "./CartLineControls";
import { useSession } from "../context/SessionContext";
import { cartLineImageUrl } from "../data/placeholder-images";

const EMPTY_CART_BG = `${import.meta.env.BASE_URL}images/cart/empty-basket-bg.webp`;

type CartPanelContentProps = {
  onNavigate?: () => void;
  showHeading?: boolean;
};

export function CartPanelContent({ onNavigate, showHeading = true }: CartPanelContentProps) {
  const { cart, cartTotal, location, clearCart } = useSession();
  const isEmpty = cart.length === 0;

  if (isEmpty) {
    return (
      <div
        className="sticky-cart__empty"
        style={{ backgroundImage: `url(${EMPTY_CART_BG})` }}
      >
        <div className="sticky-cart__empty-overlay" />
        <div className="sticky-cart__empty-copy">
          <h2 className="sticky-cart__empty-heading">Корзина</h2>
          <div className="sticky-cart__empty-message">
            <p className="sticky-cart__empty-title">ваша корзина пуста</p>
            <p className="sticky-cart__empty-sub">
              Добавьте товары
              <br />
              для оформления заказа
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky-cart__filled">
      {showHeading ? (
        <div className="sticky-cart__head">
          <h2 className="sticky-cart__heading">Корзина</h2>
          <button type="button" className="sticky-cart__clear" onClick={clearCart}>
            Очистить
          </button>
        </div>
      ) : null}
      {location ? (
        <p className="sticky-cart__location">
          <span className="sticky-cart__location-name">{location.name}</span>
          <span className="sticky-cart__location-address">{location.address}</span>
        </p>
      ) : null}
      <ul className="sticky-cart__lines">
        {cart.map((line, index) => (
          <li key={`${line.productId}-${index}`} className="sticky-cart__line">
            <span
              className="sticky-cart__thumb"
              style={{ backgroundImage: `url(${cartLineImageUrl(line)})` }}
              aria-hidden="true"
            />
            <div className="sticky-cart__line-info">
              <span className="sticky-cart__line-name">{line.name}</span>
              {line.variantLabel ? (
                <span className="sticky-cart__line-variant">{line.variantLabel}</span>
              ) : null}
              <span className="sticky-cart__line-price">
                {line.unitPrice} ₽ × {line.quantity} = {line.unitPrice * line.quantity} ₽
              </span>
              <CartLineControls index={index} quantity={line.quantity} compact />
            </div>
          </li>
        ))}
      </ul>
      <p className="sticky-cart__total">
        Сумма заказа: <strong>{cartTotal} ₽</strong>
      </p>
      <Link
        to="/checkout"
        className="sticky-cart__cta"
        onClick={() => {
          window.scrollTo(0, 0);
          onNavigate?.();
        }}
      >
        Оформить заказ
      </Link>
    </div>
  );
}
