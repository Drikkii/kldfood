import "dotenv/config";

const requiredInProduction = ["DATABASE_URL"];

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  publicApiUrl: process.env.PUBLIC_API_URL ?? `http://localhost:${process.env.PORT ?? 3001}`,
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL ?? "",
  yookassa: {
    shopId: process.env.YOOKASSA_SHOP_ID ?? "",
    secretKey: process.env.YOOKASSA_SECRET_KEY ?? "",
    returnUrl: process.env.YOOKASSA_RETURN_URL ?? "",
  },
  rkeeper: {
    wsUrl: process.env.RKEEPER_WS_URL ?? "",
    aggregatorToken: process.env.RKEEPER_AGGREGATOR_TOKEN ?? "",
    callbackUrl: process.env.RKEEPER_CALLBACK_URL ?? "",
  },
};

export function assertProductionConfig() {
  if (config.nodeEnv !== "production") return;
  for (const key of requiredInProduction) {
    if (!process.env[key]) {
      throw new Error(`Missing required env: ${key}`);
    }
  }
}
