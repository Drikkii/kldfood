import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Fulfillment, Location } from "../types/catalog";
import { mergeCartLine, normalizeCartLines } from "../utils/cart-lines";

type SessionState = {
  fulfillment: Fulfillment;
  location: Location | null;
  cartsByLocation: Record<string, CartLine[]>;
};

type AddToCartResult = "added" | "need_location";

type SessionContextValue = SessionState & {
  cart: CartLine[];
  setFulfillment: (f: Fulfillment) => void;
  setLocation: (loc: Location | null) => void;
  addToCart: (line: CartLine) => void;
  tryAddToCart: (line: CartLine) => AddToCartResult;
  confirmPendingAdd: (loc: Location) => void;
  locationPromptOpen: boolean;
  cancelPendingAdd: () => void;
  clearCart: () => void;
  removeCartLine: (index: number) => void;
  changeCartLineQuantity: (index: number, delta: number) => void;
  cartTotal: number;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const STORAGE_KEY = "kldfood_session_v1";

type StoredSession = Partial<SessionState> & {
  cart?: CartLine[];
};

function defaultSession(): SessionState {
  return { fulfillment: "pickup", location: null, cartsByLocation: {} };
}

function cartForLocation(state: SessionState, locationId: string): CartLine[] {
  return normalizeCartLines(state.cartsByLocation[locationId]);
}

function withCartForLocation(
  state: SessionState,
  locationId: string,
  cart: CartLine[],
): SessionState {
  return {
    ...state,
    cartsByLocation: {
      ...state.cartsByLocation,
      [locationId]: cart,
    },
  };
}

function addLineForLocation(
  prev: SessionState,
  locationId: string,
  line: CartLine,
): SessionState {
  return withCartForLocation(
    prev,
    locationId,
    mergeCartLine(cartForLocation(prev, locationId), line),
  );
}

function loadSession(): SessionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSession();

    const parsed = JSON.parse(raw) as StoredSession;
    const cartsByLocation = { ...(parsed.cartsByLocation ?? {}) };

    if (parsed.cart?.length && parsed.location?.id && !cartsByLocation[parsed.location.id]?.length) {
      cartsByLocation[parsed.location.id] = normalizeCartLines(parsed.cart);
    }

    for (const [locationId, cart] of Object.entries(cartsByLocation)) {
      cartsByLocation[locationId] = normalizeCartLines(cart);
    }

    return {
      fulfillment: parsed.fulfillment ?? "pickup",
      location: parsed.location ?? null,
      cartsByLocation,
    };
  } catch {
    return defaultSession();
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(() => loadSession());
  const [locationPromptOpen, setLocationPromptOpen] = useState(false);
  const pendingLineRef = useRef<CartLine | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const persist = useCallback((next: SessionState | ((prev: SessionState) => SessionState)) => {
    setState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resolved));
      stateRef.current = resolved;
      return resolved;
    });
  }, []);

  const cart = useMemo(() => {
    if (!state.location) return [];
    return cartForLocation(state, state.location.id);
  }, [state.location, state.cartsByLocation]);

  const setFulfillment = useCallback(
    (fulfillment: Fulfillment) => {
      persist((prev) => ({ ...prev, fulfillment }));
    },
    [persist],
  );

  const setLocation = useCallback(
    (loc: Location | null) => {
      persist((prev) => {
        const fromId = prev.location?.id;
        let next: SessionState = { ...prev, location: loc };

        if (loc && fromId && fromId !== loc.id) {
          const movingCart = cartForLocation(prev, fromId);
          if (movingCart.length > 0) {
            let merged = cartForLocation(prev, loc.id);
            for (const line of movingCart) {
              merged = mergeCartLine(merged, line);
            }
            next = withCartForLocation(next, fromId, []);
            next = withCartForLocation(next, loc.id, merged);
          }
        }

        if (loc && pendingLineRef.current) {
          next = addLineForLocation(next, loc.id, pendingLineRef.current);
          pendingLineRef.current = null;
        }
        return next;
      });
      if (loc) {
        setLocationPromptOpen(false);
      }
    },
    [persist],
  );

  const addToCart = useCallback(
    (line: CartLine) => {
      const loc = stateRef.current.location;
      if (!loc) return;
      persist((prev) => {
        if (!prev.location) return prev;
        return addLineForLocation(prev, prev.location.id, line);
      });
    },
    [persist],
  );

  const tryAddToCart = useCallback(
    (line: CartLine): AddToCartResult => {
      const loc = stateRef.current.location;
      if (loc) {
        persist((prev) => addLineForLocation(prev, loc.id, line));
        setLocationPromptOpen(false);
        pendingLineRef.current = null;
        return "added";
      }

      pendingLineRef.current = line;
      setLocationPromptOpen(true);
      return "need_location";
    },
    [persist],
  );

  const cancelPendingAdd = useCallback(() => {
    pendingLineRef.current = null;
    setLocationPromptOpen(false);
  }, []);

  const confirmPendingAdd = useCallback(
    (loc: Location) => {
      persist((prev) => {
        const pending = pendingLineRef.current;
        pendingLineRef.current = null;
        let next: SessionState = { ...prev, location: loc };
        if (pending) {
          next = addLineForLocation(next, loc.id, pending);
        }
        return next;
      });
      setLocationPromptOpen(false);
    },
    [persist],
  );

  const clearCart = useCallback(() => {
    persist((prev) => {
      if (!prev.location) return prev;
      return withCartForLocation(prev, prev.location.id, []);
    });
  }, [persist]);

  const removeCartLine = useCallback(
    (index: number) => {
      persist((prev) => {
        if (!prev.location) return prev;
        const locationId = prev.location.id;
        const nextCart = cartForLocation(prev, locationId).filter((_, i) => i !== index);
        return withCartForLocation(prev, locationId, nextCart);
      });
    },
    [persist],
  );

  const changeCartLineQuantity = useCallback(
    (index: number, delta: number) => {
      persist((prev) => {
        if (!prev.location) return prev;
        const locationId = prev.location.id;
        const current = cartForLocation(prev, locationId);
        const line = current[index];
        if (!line) return prev;

        const nextQty = line.quantity + delta;
        let nextCart: CartLine[];

        if (nextQty <= 0) {
          nextCart = current.filter((_, i) => i !== index);
        } else {
          nextCart = current.map((item, i) =>
            i === index ? { ...item, quantity: nextQty } : item,
          );
        }

        return withCartForLocation(prev, locationId, nextCart);
      });
    },
    [persist],
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      ...state,
      cart,
      setFulfillment,
      setLocation,
      addToCart,
      tryAddToCart,
      confirmPendingAdd,
      cancelPendingAdd,
      locationPromptOpen,
      clearCart,
      removeCartLine,
      changeCartLineQuantity,
      cartTotal,
    }),
    [
      state,
      cart,
      setFulfillment,
      setLocation,
      addToCart,
      tryAddToCart,
      confirmPendingAdd,
      cancelPendingAdd,
      locationPromptOpen,
      clearCart,
      removeCartLine,
      changeCartLineQuantity,
      cartTotal,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession outside provider");
  return ctx;
}
