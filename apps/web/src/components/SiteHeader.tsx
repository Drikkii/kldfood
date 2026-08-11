import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import type { Fulfillment, Location } from "../types/catalog";
import { BrandLogo } from "./BrandLogo";
import { BurgerMenu } from "./BurgerMenu";
import { LocationSelect } from "./LocationSelect";

const PHONE_DISPLAY = "+7 (4012) 555-00-00";
const PHONE_HREF = "tel:+74012555000";

type SiteHeaderProps = {
  locations: Location[];
};

export function SiteHeader({ locations }: SiteHeaderProps) {
  const { fulfillment, location, setFulfillment, setLocation } = useSession();
  const [burgerOpen, setBurgerOpen] = useState(false);

  const availableLocations = useMemo(
    () =>
      locations.filter((loc) => (fulfillment === "pickup" ? loc.pickup : loc.delivery)),
    [locations, fulfillment],
  );

  useEffect(() => {
    if (locations.length === 0) return;
    if (!location) return;

    const stillValid = availableLocations.some((l) => l.id === location.id);
    if (!stillValid) {
      setLocation(null);
      return;
    }

    const fresh = locations.find((l) => l.id === location.id);
    if (
      fresh &&
      (fresh.name !== location.name ||
        fresh.address !== location.address ||
        fresh.workHours !== location.workHours)
    ) {
      setLocation(fresh);
    }
  }, [locations, availableLocations, location, setLocation]);

  function onFulfillmentChange(next: Fulfillment) {
    setFulfillment(next);
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__left">
            <button
              type="button"
              className="site-header__burger"
              aria-label="Открыть меню"
              aria-expanded={burgerOpen}
              onClick={() => setBurgerOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>

            <Link to="/" className="site-header__logo" aria-label="FIRE FOOD — на главную">
              <BrandLogo compact />
            </Link>
          </div>

          <div className="site-header__center">
            <div
              className="site-header__fulfillment"
              role="group"
              aria-label="Способ получения"
              data-active={fulfillment}
            >
              <span className="site-header__fulfillment-indicator" aria-hidden="true" />
              <button
                type="button"
                className={`site-header__pill${fulfillment === "delivery" ? " is-active" : ""}`}
                onClick={() => onFulfillmentChange("delivery")}
              >
                Доставка
              </button>
              <button
                type="button"
                className={`site-header__pill${fulfillment === "pickup" ? " is-active" : ""}`}
                onClick={() => onFulfillmentChange("pickup")}
              >
                Самовывоз
              </button>
            </div>

            <LocationSelect
              className="site-header__location"
              locations={locations}
              fulfillment={fulfillment}
              location={location}
              onChange={setLocation}
            />

            <a className="site-header__phone" href={PHONE_HREF}>
              {PHONE_DISPLAY}
            </a>
          </div>

          <div className="site-header__right">
            <button type="button" className="site-header__login">
              Вход
            </button>
          </div>
        </div>
      </header>

      <BurgerMenu open={burgerOpen} onClose={() => setBurgerOpen(false)} />
    </>
  );
}
