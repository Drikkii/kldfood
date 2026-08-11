/**
 * Отправка в R-Keeper ровно один раз на заказ: Order_Num = id заказа (UUID).
 */

import { config } from "../config.js";

/**
 * @param {object} order — заказ после повторной валидации
 */
export async function submitOrderToRKeeperOnce(order) {
  if (order.rkeeperSubmittedAt && order.rkeeperTask && !order.rkeeperLastError) {
    return order.rkeeperTask;
  }

  const objectId = order.rkeeperObjectId;
  const { wsUrl, aggregatorToken, callbackUrl } = config.rkeeper;

  const taskType =
    order.fulfillment === "pickup" ? "new_order_pickup" : "new_order_delivery";

  const payload = {
    fulfillment: order.fulfillment,
    items: order.validatedLines ?? order.items,
    customer: order.customer,
    deliveryAddress: order.deliveryAddress,
    comment: order.comment,
    scheduledAt: order.scheduledAt,
    Order_Num: order.id,
    callback: callbackUrl,
  };

  if (!aggregatorToken || !objectId) {
    return {
      stub: true,
      taskType,
      taskGuid: `stub_${order.id}`,
      message: "R-Keeper not configured; order NOT sent to kitchen",
    };
  }

  const requestBody = {
    taskType: taskType === "new_order_pickup" ? "new_order_delivery" : "new_order_delivery",
    objectId,
    params: {
      ...payload,
      order_mode: order.fulfillment === "pickup" ? "pickup" : "delivery",
    },
  };

  const response = await fetch(wsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AggregatorAuthentication: aggregatorToken,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`R-Keeper WS error: ${response.status} ${text}`);
  }

  return response.json();
}
