import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import type { Fulfillment, Location } from "../types/catalog";
import { BrandLogo } from "./BrandLogo";
import { BurgerMenu } from "./BurgerMenu";
import { LocationSelect } from "./LocationSelect";

const PHONE_DISPLAY = "+7 (4012) 555-00-00";
const PHONE_HREF = "tel:+74012555000";

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.47a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.17 2.2z"
      />
    </svg>
  );
}

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

            <a className="site-header__phone site-header__phone--desktop" href={PHONE_HREF}>
              {PHONE_DISPLAY}
            </a>
          </div>

          <div className="site-header__right">
            <a
              className="site-header__phone site-header__phone--mobile"
              href={PHONE_HREF}
              aria-label={`Позвонить: ${PHONE_DISPLAY}`}
            >
              <IconPhone />
            </a>

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
