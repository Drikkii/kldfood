import { Router } from "express";
import { getCatalogForLocation } from "../services/catalog.js";
import { toPublicProduct } from "../services/catalog-public.js";

export const menuRouter = Router();

/** Меню для витрины: стабильные id из seed; коды RK только на backend. */
menuRouter.get("/", (req, res) => {
  const locationId = typeof req.query.locationId === "string" ? req.query.locationId : null;
  const catalog = getCatalogForLocation(locationId);
  res.json({
    source: catalog.source,
    syncedAt: catalog.syncedAt,
    locationId: catalog.locationId,
    categories: catalog.categories,
    products: catalog.products.map(toPublicProduct),
  });
});

menuRouter.get("/products/:id", (req, res) => {
  const locationId = typeof req.query.locationId === "string" ? req.query.locationId : "";
  const catalog = getCatalogForLocation(locationId);
  const product = catalog.products.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: "product_not_found" });
    return;
  }
  res.json({ product: toPublicProduct(product) });
});
