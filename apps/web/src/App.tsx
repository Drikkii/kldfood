import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import { AppLayout } from "./layouts/AppLayout";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { InfoPage } from "./pages/InfoPage";
import { LocationPage } from "./pages/LocationPage";
import { OrderStatusPage } from "./pages/OrderStatusPage";
import { PrivacyPage } from "./pages/PrivacyPage";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "");

export function App() {
  return (
    <SessionProvider>
      <BrowserRouter basename={routerBasename || undefined}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="promotions"
              element={
                <InfoPage title="Акции" description="Раздел в разработке. Здесь будут акции и спецпредложения FIRE FOOD." />
              }
            />
            <Route
              path="career"
              element={
                <InfoPage title="Карьера" description="Раздел в разработке. Вакансии сети FIRE FOOD в Калининграде." />
              }
            />
            <Route
              path="franchise"
              element={
                <InfoPage title="Франшиза" description="Раздел в разработке. Условия партнёрства FIRE FOOD." />
              }
            />
            <Route
              path="about"
              element={
                <InfoPage title="О компании" description="FIRE FOOD — доставка и самовывоз в Калининграде." />
              }
            />
            <Route path="location" element={<LocationPage />} />
            <Route path="cart" element={<Navigate to="/checkout" replace />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="order/:id" element={<OrderStatusPage />} />
            <Route path="order/success" element={<OrderStatusPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}
