import { OrderStatus } from "../domain/order-status.js";
import {
  canSubmitToRKeeper,
  getOrder,
  getOrderByPaymentId,
  isWebhookPaymentProcessed,
  markWebhookPaymentProcessed,
  saveOrder,
  transitionOrder,
} from "./order-store.js";
import { validateAndPriceCart } from "./cart-validation.js";
import { submitOrderToRKeeperOnce } from "./rkeeper-order.js";
import { fetchPaymentInfo } from "./yookassa.js";

/**
 * Обработка payment.succeeded — единственная точка отправки заказа в R-Keeper.
 * @param {{ id: string, status: string, metadata?: { orderId?: string }, amount?: { value: string } }} payment
 */
export async function handleYooKassaPaymentSucceeded(payment) {
  const paymentId = payment?.id;
  if (!paymentId) {
    return { handled: false, reason: "no_payment_id" };
  }

  if (isWebhookPaymentProcessed(paymentId)) {
    const existing = getOrderByPaymentId(paymentId);
    await maybeRetryRKeeper(existing);
    return { handled: true, reason: "duplicate_webhook", orderId: existing?.id };
  }

  const verified = await verifyPaymentWithProvider(payment);
  if (!verified.ok) {
    return { handled: false, reason: verified.reason };
  }

  const orderId = verified.orderId;
  const order = getOrder(orderId);
  if (!order) {
    return { handled: false, reason: "order_not_found" };
  }

  if (order.paymentId && order.paymentId !== paymentId) {
    return { handled: false, reason: "payment_id_mismatch" };
  }

  const paidTransition = transitionOrder(orderId, OrderStatus.AWAITING_PAYMENT, OrderStatus.PAID, {
    paidAt: new Date().toISOString(),
    paymentId,
    paymentAmount: verified.amountRub,
  });

  if (!paidTransition.ok) {
    markWebhookPaymentProcessed(paymentId);
    await maybeRetryRKeeper(paidTransition.order);
    return {
      handled: true,
      reason: "already_past_payment",
      orderId,
      status: paidTransition.order?.status,
    };
  }

  markWebhookPaymentProcessed(paymentId);

  const amountOk =
    Math.abs(Number(paidTransition.order.amountRub) - Number(verified.amountRub)) < 0.01;
  if (!amountOk) {
    transitionOrder(orderId, OrderStatus.PAID, OrderStatus.PAID_CART_INVALID, {
      validationError: "payment_amount_mismatch",
    });
    return { handled: true, reason: "amount_mismatch", orderId };
  }

  const revalidated = validateAndPriceCart(
    paidTransition.order.locationId,
    paidTransition.order.cartInput,
  );
  if (!revalidated.ok) {
    transitionOrder(orderId, OrderStatus.PAID, OrderStatus.PAID_CART_INVALID, {
      validationError: revalidated.error,
      validationDetails: revalidated.details,
    });
    return { handled: true, reason: "post_payment_validation_failed", orderId };
  }

  if (Math.abs(revalidated.amountRub - paidTransition.order.amountRub) >= 0.01) {
    transitionOrder(orderId, OrderStatus.PAID, OrderStatus.PAID_CART_INVALID, {
      validationError: "price_changed_after_payment",
      serverAmount: revalidated.amountRub,
    });
    return { handled: true, reason: "price_changed", orderId };
  }

  saveOrder({
    ...getOrder(orderId),
    validatedLines: revalidated.lines,
    amountRub: revalidated.amountRub,
  });

  const rkResult = await submitToRKeeperSafe(orderId);
  return { handled: true, orderId, rkeeper: rkResult };
}

async function maybeRetryRKeeper(order) {
  if (!order || !canSubmitToRKeeper(order)) return;
  await submitToRKeeperSafe(order.id);
}

async function verifyPaymentWithProvider(payment) {
  const orderId = payment.metadata?.orderId;
  if (!orderId) {
    return { ok: false, reason: "no_order_id_in_metadata" };
  }

  const remote = await fetchPaymentInfo(payment.id);
  if (remote) {
    if (remote.status !== "succeeded") {
      return { ok: false, reason: "payment_not_succeeded" };
    }
    const metaOrderId = remote.metadata?.orderId;
    if (metaOrderId !== orderId) {
      return { ok: false, reason: "metadata_order_mismatch" };
    }
    return {
      ok: true,
      orderId,
      amountRub: Number(remote.amount?.value ?? payment.amount?.value),
    };
  }

  if (payment.status !== "succeeded") {
    return { ok: false, reason: "payment_not_succeeded" };
  }

  return {
    ok: true,
    orderId,
    amountRub: Number(payment.amount?.value ?? getOrder(orderId)?.amountRub),
  };
}

async function submitToRKeeperSafe(orderId) {
  const order = getOrder(orderId);
  if (!canSubmitToRKeeper(order)) {
    return { skipped: true, reason: "already_submitted_or_in_progress" };
  }

  const lock = transitionOrder(
    orderId,
    [OrderStatus.PAID, OrderStatus.RKEEPER_FAILED],
    OrderStatus.RKEEPER_SUBMITTING,
    { rkeeperSubmitStartedAt: new Date().toISOString() },
  );

  if (!lock.ok) {
    return { skipped: true, reason: lock.reason };
  }

  try {
    const current = getOrder(orderId);
    const result = await submitOrderToRKeeperOnce(current);

    transitionOrder(orderId, OrderStatus.RKEEPER_SUBMITTING, OrderStatus.RKEEPER_SUBMITTED, {
      rkeeperTask: result,
      rkeeperOrderNum: current.id,
      rkeeperSubmittedAt: new Date().toISOString(),
    });

    return { submitted: true, result };
  } catch (err) {
    transitionOrder(orderId, OrderStatus.RKEEPER_SUBMITTING, OrderStatus.RKEEPER_FAILED, {
      rkeeperLastError: String(err.message ?? err),
    });
    return { submitted: false, error: String(err.message ?? err) };
  }
}
