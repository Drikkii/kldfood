const base = import.meta.env.VITE_API_URL ?? "";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = base ? `${base}${path}` : path;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string; details?: unknown };
    throw new Error(err.error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export function fetchLocations() {
  return apiFetch<{ locations: import("../types/catalog").Location[] }>("/api/locations");
}

export function fetchMenu(locationId: string | null) {
  const q = locationId ? `?locationId=${encodeURIComponent(locationId)}` : "";
  return apiFetch<{
    categories: import("../types/catalog").MenuCategory[];
    products: import("../types/catalog").MenuProduct[];
  }>(`/api/menu${q}`);
}

export function createOrder(body: Record<string, unknown>) {
  return apiFetch<{
    order: { id: string; status: string; fulfillment: string; amountRub?: number };
    payment: { confirmationUrl?: string; stub?: boolean };
  }>("/api/orders", { method: "POST", body: JSON.stringify(body) });
}

export function devConfirmPayment(orderId: string) {
  return apiFetch<{ order: Record<string, unknown>; result: Record<string, unknown> }>(
    `/api/orders/${orderId}/dev-confirm-payment`,
    { method: "POST", body: "{}" },
  );
}

export function fetchOrder(id: string) {
  return apiFetch<{ order: Record<string, unknown> }>(`/api/orders/${id}`);
}
