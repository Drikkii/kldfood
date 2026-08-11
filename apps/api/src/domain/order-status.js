/** @readonly */
export const OrderStatus = {
  AWAITING_PAYMENT: "awaiting_payment",
  PAID: "paid",
  PAID_CART_INVALID: "paid_cart_invalid",
  RKEEPER_SUBMITTING: "rkeeper_submitting",
  RKEEPER_SUBMITTED: "rkeeper_submitted",
  RKEEPER_ACCEPTED: "rkeeper_accepted",
  RKEEPER_FAILED: "rkeeper_failed",
  CANCELLED: "cancelled",
};

/** Статусы, при которых повторная отправка в R-Keeper запрещена (уже ушло или принято). */
export const RKEEPER_TERMINAL_OR_SENT = new Set([
  OrderStatus.RKEEPER_SUBMITTING,
  OrderStatus.RKEEPER_SUBMITTED,
  OrderStatus.RKEEPER_ACCEPTED,
]);
