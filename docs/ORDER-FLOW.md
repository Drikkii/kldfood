# Поток заказа (R-Keeper + ЮKassa)

Те же принципы, что у интеграции с iiko, но POS — **R-Keeper White Server**.

## Цепочка

```
[Фронт] меню ← API ← каталог R-Keeper (сейчас mock)
[Фронт] корзина только в браузере (localStorage)
[Фронт] checkout → POST /api/orders (без доверия к ценам клиента)

[Backend] validateAndPriceCart:
  - товар существует для точки
  - варианты / модификаторы
  - стоп-лист
  - сумма только серверная

[Backend] заказ status=awaiting_payment
[Backend] createYooKassaPayment (Idempotence-Key = orderId)
[Backend] НЕ вызывает R-Keeper

[ЮKassa] payment.succeeded → POST /api/webhooks/yookassa

[Backend] handleYooKassaPaymentSucceeded:
  1. идемпотентность по payment.id
  2. GET /v3/payments/{id} у ЮKassa (если ключи есть)
  3. CAS awaiting_payment → paid
  4. сверка суммы платежа с заказом
  5. повторная validateAndPriceCart (стоп-лист / цены)
  6. CAS paid → rkeeper_submitting → R-Keeper (Order_Num = order.id)
  7. rkeeper_submitted → callback → rkeeper_accepted

[R-Keeper] callback POST /api/webhooks/rkeeper — только обновление статуса, без нового заказа
```

## Защита от задвоения

| Риск | Мера |
|------|------|
| Двойной webhook ЮKassa | `processedWebhookPaymentIds` + переход статуса только из `awaiting_payment` |
| Повторная отправка в RK | Статусы `rkeeper_submitting/submitted/accepted`; `Order_Num` = UUID заказа |
| Клиент подменил цену | `amountRub` не принимается из body; только результат валидации |
| Оплата без webhook | Заказ не уходит на кухню |
| Подделка webhook | Повторный запрос статуса платежа в API ЮKassa |
| Гонка двух webhook | CAS `transitionOrder` по текущему status |

## Статусы заказа

- `awaiting_payment` — создан, ждём оплату
- `paid` — webhook принят, прошли проверки суммы
- `paid_cart_invalid` — оплачено, но повторная валидация не прошла (нужен возврат / поддержка)
- `rkeeper_submitting` — блокировка на время вызова WS
- `rkeeper_submitted` — задача ушла в White Server
- `rkeeper_accepted` — callback от агента
- `rkeeper_failed` — ошибка WS; повтор возможен только из этого статуса (один поток)

## Dev без ключей

1. `POST /api/orders` → redirect с `stub=1`
2. `POST /api/orders/:id/dev-confirm-payment` (только `NODE_ENV !== production`) — имитация webhook

## Файлы

- `services/cart-validation.js` — проверка корзины
- `services/catalog.js` — меню / стоп-лист по точке
- `services/payment-handler.js` — webhook → RK
- `services/rkeeper-order.js` — один вызов WS на заказ
- `services/order-store.js` — хранилище и CAS (in-memory → PostgreSQL)
