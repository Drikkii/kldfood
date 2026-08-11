import { Router } from "express";
import { mockLocations } from "../data/mock-locations.js";

export const locationsRouter = Router();

/** Список точек для выбора «откуда готовим» (самовывоз / доставка с кухни). */
locationsRouter.get("/", (_req, res) => {
  res.json({ locations: mockLocations });
});

locationsRouter.get("/:id", (req, res) => {
  const location = mockLocations.find((l) => l.id === req.params.id);
  if (!location) {
    res.status(404).json({ error: "location_not_found" });
    return;
  }
  res.json({ location });
});
