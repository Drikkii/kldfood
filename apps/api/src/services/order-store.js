import { OrderStatus, RKEEPER_TERMINAL_OR_SENT } from "../domain/order-status.js";

/** @type {Map<string, object>} */
const orders = new Map();

/** payment.id от ЮKassa → orderId (идемпотентность webhook) */
/** @type {Map<string, string>} */
const paymentToOrder = new Map();

/** @type {Set<string>} */
const processedWebhookPaymentIds = new Set();

export function saveOrder(order) {
  orders.set(order.id, order);
  if (order.paymentId) {
    paymentToOrder.set(order.paymentId, order.id);
  }
  return order;
}

export function getOrder(orderId) {
  return orders.get(orderId) ?? null;
}

export function getOrderByPaymentId(paymentId) {
  const orderId = paymentToOrder.get(paymentId);
  return orderId ? getOrder(orderId) : null;
}

export function isWebhookPaymentProcessed(paymentId) {
  return processedWebhookPaymentIds.has(paymentId);
}

export function markWebhookPaymentProcessed(paymentId) {
  processedWebhookPaymentIds.add(paymentId);
}

/**
 * Атомарный переход статуса (in-memory CAS). Защита от гонок при двойном webhook.
 * @param {string} orderId
 * @param {string|string[]} expectedFrom
 * @param {string} toStatus
 * @param {Record<string, unknown>} [patch]
 */
export function transitionOrder(orderId, expectedFrom, toStatus, patch = {}) {
  const order = orders.get(orderId);
  if (!order) return { ok: false, reason: "not_found", order: null };

  const allowed = Array.isArray(expectedFrom) ? expectedFrom : [expectedFrom];
  if (!allowed.includes(order.status)) {
    return { ok: false, reason: "status_mismatch", order };
  }

  const next = {
    ...order,
    ...patch,
    status: toStatus,
    updatedAt: new Date().toISOString(),
  };
  orders.set(orderId, next);
  if (next.paymentId) {
    paymentToOrder.set(next.paymentId, orderId);
  }
  return { ok: true, order: next };
}

/**
 * Можно ли отправлять заказ в R-Keeper (не дублировать).
 * @param {object} order
 */
export function canSubmitToRKeeper(order) {
  if (!order) return false;
  if (RKEEPER_TERMINAL_OR_SENT.has(order.status)) return false;
  if (order.rkeeperSubmitStartedAt && order.status !== OrderStatus.RKEEPER_FAILED) {
    return false;
  }
  return order.status === OrderStatus.PAID || order.status === OrderStatus.RKEEPER_FAILED;
}

export function publicOrderView(order) {
  if (!order) return null;
  return {
    id: order.id,
    status: order.status,
    fulfillment: order.fulfillment,
    locationId: order.locationId,
    amountRub: order.amountRub,
    createdAt: order.createdAt,
    paidAt: order.paidAt ?? null,
    rkeeperAcceptedAt: order.rkeeperAcceptedAt ?? null,
  };
}
