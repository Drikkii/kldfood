import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { HeroSlider } from "../components/HeroSlider";
import { LocationPromptModal } from "../components/LocationPromptModal";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { useSession } from "../context/SessionContext";
import type { Location } from "../types/catalog";
import { loadLocations } from "../utils/load-locations";

export function AppLayout() {
  const { locationPromptOpen, cancelPendingAdd } = useSession();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    loadLocations().then(setLocations);
  }, []);

  return (
    <div className="app-shell">
      <SiteHeader locations={locations} />
      <div className="app-content">
        {isHome ? <HeroSlider /> : null}
        <main className={`app-main${isHome ? " app-main--home" : ""}`}>
          <Outlet />
        </main>
      </div>
      <SiteFooter />
      <LocationPromptModal
        open={locationPromptOpen}
        onClose={cancelPendingAdd}
        locations={locations}
      />
    </div>
  );
}
