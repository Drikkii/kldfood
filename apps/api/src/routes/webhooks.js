import { Router } from "express";
import { getOrder, transitionOrder } from "../services/order-store.js";
import { handleYooKassaPaymentSucceeded } from "../services/payment-handler.js";
import { OrderStatus } from "../domain/order-status.js";

export const webhooksRouter = Router();

/**
 * ЮKassa → только здесь создаём заказ в R-Keeper (после проверок).
 * Всегда 200 на известные события, чтобы не было бесконечных ретраев с дублями.
 */
webhooksRouter.post("/yookassa", async (req, res, next) => {
  try {
    const event = req.body?.event;
    const payment = req.body?.object;

    if (event === "payment.succeeded" && payment) {
      const result = await handleYooKassaPaymentSucceeded(payment);
      console.log("[yookassa webhook]", result);
    }

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

/** Callback White Server — подтверждение приёма заказа на кухне (не создаёт новый заказ). */
webhooksRouter.post("/rkeeper", (req, res) => {
  const body = req.body ?? {};
  const orderNum = body?.params?.Order_Num ?? body?.Order_Num ?? body?.orderNum;

  if (orderNum) {
    const order = getOrder(String(orderNum));
    if (order && order.status === OrderStatus.RKEEPER_SUBMITTED) {
      transitionOrder(String(orderNum), OrderStatus.RKEEPER_SUBMITTED, OrderStatus.RKEEPER_ACCEPTED, {
        rkeeperAcceptedAt: new Date().toISOString(),
        rkeeperCallback: body,
      });
    }
  }

  console.log("[rkeeper callback]", JSON.stringify(body));
  res.sendStatus(200);
});
