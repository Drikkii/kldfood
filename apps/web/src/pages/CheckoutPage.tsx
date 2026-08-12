import { type FormEvent, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createOrder } from "../api/client";
import { CartLineControls } from "../components/CartLineControls";
import { CartUpsell } from "../components/CartUpsell";
import { LocationSelect } from "../components/LocationSelect";
import { ReadyTimeSelect } from "../components/ReadyTimeSelect";
import { useSession } from "../context/SessionContext";
import type { Location } from "../types/catalog";
import { cartLineImageUrl } from "../data/placeholder-images";
import { loadLocations } from "../utils/load-locations";
import { buildReadyTimeSlots, defaultReadyTimeSlot } from "../utils/ready-time-slots";

type PaymentMethod = "cash" | "online";

export function CheckoutPage() {
  const { fulfillment, location, cart, cartTotal, clearCart, setLocation } = useSession();
  const readyTimeSlots = useMemo(() => buildReadyTimeSlots(), []);
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [readyTime, setReadyTime] = useState(() => defaultReadyTimeSlot());
  const [comment, setComment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadLocations().then(setLocations);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!location || cart.length === 0 || !consent) return;
    setLoading(true);
    setError(null);

    const paymentLabel = paymentMethod === "cash" ? "Наличные" : "Картой онлайн";
    const timeLabel = `Время готовности: ${readyTime}`;
    const paymentNote = `Способ оплаты: ${paymentLabel}`;
    const fullComment = [timeLabel, paymentNote, comment.trim()].filter(Boolean).join(". ");

    try {
      const result = await createOrder({
        fulfillment,
        locationId: location.id,
        items: cart.map(({ productId, quantity, selections, modifiers }) => ({
          productId,
          quantity,
          selections,
          modifiers: modifiers?.length ? modifiers : undefined,
        })),
        customer: { name, phone },
        deliveryAddress:
          fulfillment === "delivery" ? { line1: deliveryAddress } : undefined,
        comment: fullComment,
      });

      if (result.payment.stub && result.payment.confirmationUrl) {
        window.location.href = result.payment.confirmationUrl;
        return;
      }
      clearCart();
    } catch (err) {
      setError(String((err as Error).message));
    } finally {
      setLoading(false);
    }
  }

  if (!location) {
    return (
      <section className="checkout-page">
        <p className="checkout-page__notice">
          Выберите точку в шапке сайта или ниже, чтобы оформить заказ.
        </p>
        <div className="checkout-page__form checkout-page__form--standalone">
          <label className="checkout-field">
            <span className="checkout-field__label">
              {fulfillment === "delivery" ? "Точка доставки" : "Пункт самовывоза"}
            </span>
            <LocationSelect
              className="checkout-location-select"
              selectClassName="checkout-location-select__control"
              locations={locations}
              fulfillment={fulfillment}
              location={location}
              onChange={setLocation}
            />
          </label>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <p>
        Корзина пуста. <Link to="/">Меню</Link>
      </p>
    );
  }

  const locationLabel =
    fulfillment === "delivery" ? "Точка доставки" : "Выберите пункт самовывоза";

  return (
    <section className="checkout-page">
      <nav className="checkout-page__crumbs" aria-label="Навигация">
        <Link to="/">Главная</Link>
        <span aria-hidden="true">/</span>
        <span>Оформление заказа</span>
      </nav>

      <h1 className="checkout-page__title">Оформление заказа</h1>

      <div className="checkout-page__layout">
        <aside className="checkout-page__cart" aria-label="Ваш заказ">
          <ul className="checkout-cart__lines">
            {cart.map((line, i) => (
              <li key={`${line.productId}-${i}`} className="checkout-cart__line">
                <span
                  className="checkout-cart__thumb"
                  style={{ backgroundImage: `url(${cartLineImageUrl(line)})` }}
                  aria-hidden="true"
                />
                <div className="checkout-cart__body">
                  <strong className="checkout-cart__name">{line.name}</strong>
                  {line.variantLabel ? (
                    <span className="checkout-cart__variant">{line.variantLabel}</span>
                  ) : null}
                  <span className="checkout-cart__price">
                    {line.unitPrice} ₽ × {line.quantity} = {line.unitPrice * line.quantity} ₽
                  </span>
                  {line.extrasLabel ? (
                    <span className="checkout-cart__extras">Допы: {line.extrasLabel}</span>
                  ) : null}
                  <CartLineControls index={i} quantity={line.quantity} />
                </div>
              </li>
            ))}
          </ul>
          <p className="checkout-cart__total">
            Итого: <strong>{cartTotal} ₽</strong>
          </p>
          <CartUpsell variant="checkout" heading="Рекомендуем попробовать" />
        </aside>

        <form className="checkout-page__form" onSubmit={onSubmit}>
          <label className="checkout-field">
            <span className="checkout-field__label">{locationLabel}</span>
            <LocationSelect
              className="checkout-location-select"
              selectClassName="checkout-location-select__control"
              locations={locations}
              fulfillment={fulfillment}
              location={location}
              onChange={setLocation}
            />
          </label>

          <label className="checkout-field">
            <span className="checkout-field__label">Время готовности заказа</span>
            <ReadyTimeSelect
              value={readyTime}
              slots={readyTimeSlots}
              onChange={setReadyTime}
              required
            />
          </label>

          {fulfillment === "delivery" ? (
            <label className="checkout-field">
              <span className="checkout-field__label">Адрес доставки</span>
              <textarea
                className="checkout-field__input"
                required
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Улица, дом, подъезд, квартира"
              />
            </label>
          ) : null}

          <label className="checkout-field">
            <span className="checkout-field__label">Имя</span>
            <input
              className="checkout-field__input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>

          <label className="checkout-field">
            <span className="checkout-field__label">Телефон</span>
            <input
              className="checkout-field__input"
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              placeholder="+7"
            />
          </label>

          <label className="checkout-field">
            <span className="checkout-field__label">Комментарий к заказу</span>
            <textarea
              className="checkout-field__input"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Пожелания к заказу"
            />
          </label>

          <fieldset className="checkout-field">
            <legend className="checkout-field__label">Способ оплаты</legend>
            <label className="checkout-radio">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              <span>Картой онлайн</span>
            </label>
            <label className="checkout-radio">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              <span>Наличными при получении</span>
            </label>
          </fieldset>

          <label className="checkout-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              Подтверждая оформление заказа, вы даёте согласие на обработку и распространение
              персональных данных и соглашаетесь с условиями{" "}
              <Link to="/privacy">политики конфиденциальности и возврата</Link> и{" "}
              <Link to="/privacy">положения о порядке обработки персональных данных</Link>.
            </span>
          </label>

          {error ? (
            <p className="checkout-page__error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="checkout-page__submit"
            disabled={loading || !consent}
          >
            {loading ? "…" : `Сделать заказ ${cartTotal} ₽`}
          </button>
        </form>
      </div>
    </section>
  );
}
