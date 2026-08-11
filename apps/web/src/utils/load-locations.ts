import { fetchLocations } from "../api/client";
import { FALLBACK_LOCATIONS } from "../data/fallback-locations";
import type { Location } from "../types/catalog";

export async function loadLocations(): Promise<Location[]> {
  try {
    const data = await fetchLocations();
    return data.locations.length > 0 ? data.locations : FALLBACK_LOCATIONS;
  } catch {
    return FALLBACK_LOCATIONS;
  }
}
