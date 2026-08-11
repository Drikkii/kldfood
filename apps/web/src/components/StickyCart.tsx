import { Link } from "react-router-dom";
import { CartLineControls } from "./CartLineControls";
import { useSession } from "../context/SessionContext";
import { cartLineImageUrl } from "../data/placeholder-images";

const EMPTY_CART_BG = `${import.meta.env.BASE_URL}images/cart/empty-basket-bg.webp`;

export function StickyCart() {
  const { cart, cartTotal, location } = useSession();
  const isEmpty = cart.length === 0;

  return (
    <div className="sticky-cart-shell">
      <aside className="sticky-cart" aria-label="Корзина">
        {isEmpty ? (
        <div
          className="sticky-cart__empty"
          style={{ backgroundImage: `url(${EMPTY_CART_BG})` }}
        >
          <div className="sticky-cart__empty-overlay" />
          <div className="sticky-cart__empty-copy">
            <p className="sticky-cart__empty-title">ваша корзина капуста</p>
            <p className="sticky-cart__empty-sub">
              Добавьте товары
              <br />
              для оформления заказа
            </p>
          </div>
        </div>
      ) : (
        <div className="sticky-cart__filled">
          <h2 className="sticky-cart__heading">Корзина</h2>
          {location ? <p className="sticky-cart__location">{location.name}</p> : null}
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
          <Link to="/checkout" className="sticky-cart__cta">
            Оформить заказ
          </Link>
        </div>
      )}
      </aside>
    </div>
  );
}
