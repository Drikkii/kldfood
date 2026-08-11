import { randomUUID } from "node:crypto";
import { Router } from "express";
import { mockLocations } from "../data/mock-locations.js";
import { validateAndPriceCart } from "../services/cart-validation.js";
import {
  getOrder,
  publicOrderView,
  saveOrder,
} from "../services/order-store.js";
import { createYooKassaPayment } from "../services/yookassa.js";
import { OrderStatus } from "../domain/order-status.js";
import { config } from "../config.js";
import { handleYooKassaPaymentSucceeded } from "../services/payment-handler.js";

export const ordersRouter = Router();

/**
 * POST /api/orders
 * Корзина с клиента — только id товаров, кол-во, выбранные варианты.
 * Цены и сумму пересчитывает backend. В R-Keeper заказ НЕ уходит.
 */
ordersRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const fulfillment = body.fulfillment;
    if (fulfillment !== "delivery" && fulfillment !== "pickup") {
      res.status(400).json({ error: "invalid_fulfillment" });
      return;
    }

    const location = mockLocations.find((l) => l.id === body.locationId);
    if (!location) {
      res.status(400).json({ error: "invalid_location" });
      return;
    }
    if (fulfillment === "delivery" && !location.delivery) {
      res.status(400).json({ error: "delivery_not_available" });
      return;
    }
    if (fulfillment === "pickup" && !location.pickup) {
      res.status(400).json({ error: "pickup_not_available" });
      return;
    }

    const cartInput = Array.isArray(body.items) ? body.items : [];
    const priced = validateAndPriceCart(location.id, cartInput);
    if (!priced.ok) {
      res.status(422).json({
        error: priced.error,
        details: priced.details,
      });
      return;
    }

    const orderId = randomUUID();
    const order = {
      id: orderId,
      status: OrderStatus.AWAITING_PAYMENT,
      fulfillment,
      locationId: location.id,
      rkeeperObjectId: location.rkeeperObjectId,
      cartInput,
      validatedLines: priced.lines,
      items: priced.lines,
      customer: body.customer ?? {},
      deliveryAddress: fulfillment === "delivery" ? body.deliveryAddress : null,
      comment: body.comment ?? "",
      scheduledAt: body.scheduledAt ?? null,
      amountRub: priced.amountRub,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveOrder(order);

    const payment = await createYooKassaPayment({
      orderId,
      amountRub: priced.amountRub,
      description: `Заказ ${orderId.slice(0, 8)}`,
      customerEmail: body.customer?.email,
    });

    saveOrder({
      ...getOrder(orderId),
      paymentId: payment.paymentId,
      paymentStub: payment.stub ?? false,
    });

    res.status(201).json({
      order: publicOrderView(getOrder(orderId)),
      payment: {
        confirmationUrl: payment.confirmationUrl,
        stub: payment.stub,
      },
    });
  } catch (err) {
    next(err);
  }
});

ordersRouter.get("/:id", (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) {
    res.status(404).json({ error: "order_not_found" });
    return;
  }
  res.json({ order: publicOrderView(order) });
});

/**
 * Dev/stub: имитация webhook ЮKassa после тестового редиректа.
 * В production отключено — только реальный webhook.
 */
ordersRouter.post("/:id/dev-confirm-payment", async (req, res, next) => {
  try {
    if (config.nodeEnv === "production") {
      res.status(404).json({ error: "not_found" });
      return;
    }

    const order = getOrder(req.params.id);
    if (!order) {
      res.status(404).json({ error: "order_not_found" });
      return;
    }

    const result = await handleYooKassaPaymentSucceeded({
      id: order.paymentId ?? `stub_${order.id}`,
      status: "succeeded",
      metadata: { orderId: order.id },
      amount: { value: String(order.amountRub) },
    });

    res.json({ result, order: publicOrderView(getOrder(order.id)) });
  } catch (err) {
    next(err);
  }
});
