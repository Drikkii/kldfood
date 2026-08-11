import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { devConfirmPayment, fetchOrder } from "../api/client";

export function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [search] = useSearchParams();
  const orderId = id ?? search.get("orderId") ?? "";
  const isStub = search.get("stub") === "1";
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    async function load() {
      try {
        if (isStub) {
          setConfirming(true);
          const confirmed = await devConfirmPayment(orderId);
          setOrder(confirmed.order);
          setConfirming(false);
          return;
        }
        const data = await fetchOrder(orderId);
        setOrder(data.order);
      } catch (e) {
        setError(String((e as Error).message));
        setConfirming(false);
      }
    }

    load();
  }, [orderId, isStub]);

  return (
    <section className="stack">
      <h2>Заказ</h2>
      {confirming && <p className="muted">Подтверждение оплаты (dev stub → webhook)…</p>}
      {!orderId && <p className="muted">Нет номера заказа.</p>}
      {error && <p role="alert">{error}</p>}
      {order && (
        <>
          <p>
            Статус: <strong>{String(order.status)}</strong>
          </p>
          <p className="muted">
            В R-Keeper заказ уходит только после webhook ЮKassa. Дубль исключается по paymentId и
            Order_Num.
          </p>
        </>
      )}
      {isStub && order && (
        <p className="muted">Тестовый сценарий: вызван POST /api/orders/:id/dev-confirm-payment</p>
      )}
      <Link to="/">На главную</Link>
    </section>
  );
}
