import cors from "cors";
import express from "express";
import { assertProductionConfig, config } from "./config.js";
import { locationsRouter } from "./routes/locations.js";
import { menuRouter } from "./routes/menu.js";
import { ordersRouter } from "./routes/orders.js";
import { healthRouter } from "./routes/health.js";
import { webhooksRouter } from "./routes/webhooks.js";

assertProductionConfig();

const app = express();

const liveServerOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(
  cors({
    origin(origin, callback) {
      if (config.nodeEnv === "production") {
        callback(null, origin === config.webOrigin ? origin : false);
        return;
      }
      if (!origin || liveServerOrigin.test(origin) || origin === config.webOrigin) {
        callback(null, true);
        return;
      }
      callback(null, true);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/webhooks", webhooksRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal_error" });
});

app.listen(config.port, () => {
  console.log(`kldfood API listening on ${config.port}`);
});
