import { useMemo } from "react";
import type { Fulfillment, Location } from "../types/catalog";

type LocationSelectProps = {
  locations: Location[];
  fulfillment: Fulfillment;
  location: Location | null;
  onChange: (loc: Location | null) => void;
  className?: string;
  selectClassName?: string;
  disabled?: boolean;
};

export function LocationSelect({
  locations,
  fulfillment,
  location,
  onChange,
  className = "location-select",
  selectClassName,
  disabled,
}: LocationSelectProps) {
  const availableLocations = useMemo(
    () => locations.filter((loc) => (fulfillment === "pickup" ? loc.pickup : loc.delivery)),
    [locations, fulfillment],
  );

  function onLocationChange(locationId: string) {
    if (!locationId) {
      onChange(null);
      return;
    }
    const picked = availableLocations.find((l) => l.id === locationId) ?? null;
    onChange(picked);
  }

  return (
    <label className={className}>
      <span className="visually-hidden">Точка</span>
      <select
        className={selectClassName}
        value={location?.id ?? ""}
        disabled={disabled}
        onChange={(e) => onLocationChange(e.target.value)}
      >
        <option value="">Выберите точку</option>
        {availableLocations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.name} · {loc.address}
          </option>
        ))}
      </select>
    </label>
  );
}
