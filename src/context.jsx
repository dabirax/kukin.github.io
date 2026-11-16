import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import reducer from "./reducer.jsx";
import { useAuth } from "./auth/useAuth.js";
import { getCart as fetchCart, replaceCart } from "./api/cart.js";
import { AppContext } from "./contextCore.js";

const initialState = {
  loading: false,
  cart: [],
  subtotal: 0,
  noOfItems: 0,
};

const readFavorites = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem("kukin:favorites"));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const cartSignature = (items) =>
  JSON.stringify(
    items
      .map((item) => [Number(item.id), Number(item.amount)])
      .sort((a, b) => a[0] - b[0])
  );

const AppProvider = ({ children }) => {
  const { isAuthenticated, initializing, openAuth } = useAuth();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const [toasts, setToasts] = useState([]);
  const [cartBump, setCartBump] = useState(0);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2500);
  }, []);

  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    localStorage.setItem("kukin:favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  }, []);

  const [state, dispatch] = useReducer(reducer, initialState);

  const lastSyncedRef = useRef("");
  const hydratingRef = useRef(false);

  useEffect(() => {
    if (initializing) return undefined;

    let active = true;

    if (!isAuthenticated) {
      lastSyncedRef.current = "";
      hydratingRef.current = false;
      dispatch({ type: "CLEAR" });
      return undefined;
    }

    hydratingRef.current = true;
    dispatch({ type: "LOADING" });

    fetchCart()
      .then((data) => {
        if (!active) return;
        const items = Array.isArray(data?.items) ? data.items : [];
        lastSyncedRef.current = cartSignature(items);
        dispatch({ type: "HYDRATE", payload: items });
      })
      .catch((error) => {
        if (!active) return;
        if (error.code !== "AUTH_REQUIRED" && error.code !== "AUTH_INVALID") {
          notify(error.message || "Unable to load your cart.");
        }
      })
      .finally(() => {
        if (active) {
          hydratingRef.current = false;
          dispatch({ type: "STOP_LOADING" });
        }
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, initializing, notify]);

  useEffect(() => {
    if (initializing || !isAuthenticated || hydratingRef.current) {
      return undefined;
    }

    const signature = cartSignature(state.cart);
    if (signature === lastSyncedRef.current) return undefined;

    const timer = window.setTimeout(() => {
      const items = state.cart.map((item) => ({
        productId: Number(item.id),
        amount: Number(item.amount),
      }));

      replaceCart(items)
        .then(() => {
          lastSyncedRef.current = signature;
        })
        .catch((error) => {
          if (error.code !== "AUTH_REQUIRED" && error.code !== "AUTH_INVALID") {
            notify(error.message || "Unable to save your cart.");
          }
        });
    }, 600);

    return () => window.clearTimeout(timer);
  }, [state.cart, isAuthenticated, initializing, notify]);

  const removeItem = useCallback((id) => {
    dispatch({ type: "REMOVE", payload: id });
  }, []);

  const addItem = useCallback(
    (product) => {
      if (!isAuthenticated) {
        openAuth("login", { notice: "Sign in to start your order." });
        return false;
      }

      dispatch({ type: "ADD", payload: product });
      setCartBump((value) => value + 1);
      return true;
    },
    [isAuthenticated, openAuth]
  );

  const increase = useCallback((id) => {
    dispatch({ type: "INCREASE", payload: id });
  }, []);

  const decrease = useCallback((id) => {
    dispatch({ type: "DECREASE", payload: id });
  }, []);

  useEffect(() => {
    dispatch({ type: "GET_TOTALS" });
  }, [state.cart]);

  const value = useMemo(
    () => ({
      isCartOpen,
      openCart,
      closeCart,
      isSidebarOpen,
      openSidebar,
      closeSidebar,
      ...state,
      removeItem,
      increase,
      decrease,
      addItem,
      toasts,
      notify,
      dismissToast,
      cartBump,
      favorites,
      toggleFavorite,
    }),
    [
      isCartOpen,
      isSidebarOpen,
      state,
      removeItem,
      increase,
      decrease,
      addItem,
      toasts,
      notify,
      dismissToast,
      cartBump,
      favorites,
      toggleFavorite,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppProvider };
