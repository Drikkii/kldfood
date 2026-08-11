import { useMemo } from "react";
import { useSession } from "../context/SessionContext";
import type { Location } from "../types/catalog";

type LocationPromptModalProps = {
  open: boolean;
  onClose: () => void;
  locations: Location[];
};

export function LocationPromptModal({ open, onClose, locations }: LocationPromptModalProps) {
  const { fulfillment, confirmPendingAdd } = useSession();

  const available = useMemo(
    () => locations.filter((loc) => (fulfillment === "pickup" ? loc.pickup : loc.delivery)),
    [locations, fulfillment],
  );

  if (!open) return null;

  function pickLocation(loc: Location) {
    confirmPendingAdd(loc);
  }

  return (
    <div className="location-prompt" role="dialog" aria-modal="true" aria-labelledby="location-prompt-title">
      <button type="button" className="location-prompt__backdrop" aria-label="Закрыть" onClick={onClose} />
      <div className="location-prompt__panel">
        <button type="button" className="location-prompt__close" aria-label="Закрыть" onClick={onClose}>
          ×
        </button>
        <h2 id="location-prompt-title" className="location-prompt__title">
          Выберите точку
        </h2>
        <p className="location-prompt__lead">
          Чтобы добавить блюдо в корзину, укажите точку {fulfillment === "pickup" ? "самовывоза" : "доставки"}.
        </p>
        <ul className="location-prompt__list">
          {available.map((loc) => (
            <li key={loc.id}>
              <button type="button" className="location-prompt__option" onClick={() => pickLocation(loc)}>
                <strong>{loc.name}</strong>
                <span>
                  {loc.address} · {loc.workHours}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {available.length === 0 ? (
          <p className="location-prompt__empty">Нет точек для выбранного способа получения.</p>
        ) : null}
      </div>
    </div>
  );
}
