/**
 * Создание платежа ЮKassa — заглушка до получения ключей.
 * @see https://yookassa.ru/developers/api#create_payment
 */

import { config } from "../config.js";

/**
 * @param {{ orderId: string, amountRub: number, description: string, customerEmail?: string }} params
 */
export async function createYooKassaPayment(params) {
  const { shopId, secretKey, returnUrl } = config.yookassa;
  if (!shopId || !secretKey) {
    return {
      stub: true,
      paymentId: `stub_${params.orderId}`,
      confirmationUrl: `${returnUrl || config.webOrigin}?orderId=${params.orderId}&stub=1`,
    };
  }

  const idempotenceKey = params.orderId;
  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");
  const body = {
    amount: { value: params.amountRub.toFixed(2), currency: "RUB" },
    capture: true,
    confirmation: { type: "redirect", return_url: returnUrl },
    description: params.description,
    metadata: { orderId: params.orderId },
  };

  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      "Idempotence-Key": idempotenceKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`YooKassa error: ${response.status} ${text}`);
  }

  const data = await response.json();
  return {
    stub: false,
    paymentId: data.id,
    confirmationUrl: data.confirmation?.confirmation_url,
  };
}

/**
 * Повторная проверка платежа при webhook (защита от подделки тела запроса).
 * @param {string} paymentId
 */
export async function fetchPaymentInfo(paymentId) {
  const { shopId, secretKey } = config.yookassa;
  if (!shopId || !secretKey) {
    return null;
  }

  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");
  const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
