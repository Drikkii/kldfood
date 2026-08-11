import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadLocations } from "../utils/load-locations";
import { useSession } from "../context/SessionContext";
import type { Fulfillment, Location } from "../types/catalog";

export function LocationPage() {
  const { fulfillment, location, setFulfillment, setLocation } = useSession();
  const [list, setList] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations()
      .then(setList)
      .catch((e) => setError(String(e.message)));
  }, []);

  const available = list.filter((l) =>
    fulfillment === "pickup" ? l.pickup : l.delivery,
  );

  return (
    <section className="stack">
      <h2>Точка и способ получения</h2>
      <p className="muted">
        Как на сетевых сайтах: сначала город/точка, затем меню с ценами этой кухни. Для R-Keeper у
        каждой точки будет свой objectId.
      </p>

      <fieldset className="stack">
        <legend>Способ получения</legend>
        <label>
          <input
            type="radio"
            name="fulfillment"
            checked={fulfillment === "pickup"}
            onChange={() => setFulfillment("pickup" as Fulfillment)}
          />{" "}
          Самовывоз
        </label>
        <label>
          <input
            type="radio"
            name="fulfillment"
            checked={fulfillment === "delivery"}
            onChange={() => setFulfillment("delivery" as Fulfillment)}
          />{" "}
          Доставка
        </label>
      </fieldset>

      {error && <p role="alert">{error}</p>}

      <div className="stack">
        {available.map((loc) => (
          <label key={loc.id} className="card">
            <input
              type="radio"
              name="location"
              checked={location?.id === loc.id}
              onChange={() => setLocation(loc)}
            />{" "}
            <strong>{loc.name}</strong>
            <div className="muted">
              {loc.address} · {loc.workHours}
            </div>
          </label>
        ))}
        {available.length === 0 && !error && (
          <p className="muted">Нет точек для выбранного режима (заглушка API).</p>
        )}
      </div>

      {location && (
        <Link to="/">Перейти в меню</Link>
      )}
    </section>
  );
}
