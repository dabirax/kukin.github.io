import React, { useState, useContext, useReducer, useEffect } from "react";
import SampleCartData from "./SampleCartData";
import reducer from "./components/Cart/reducer.jsx";

const AppContext = React.createContext();

const initialState = {
  loading: false,
  cart: SampleCartData,
  subtotal: 0,
  noOfItems: 0,
};

const AppProvider = ({ children }) => {
  // Sidebar and Cart toggling
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openCart = () => {
    setIsCartOpen(true);
  };
  const closeCart = () => {
    setIsCartOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Cart reducer
  const [state, dispatch] = useReducer(reducer, initialState);

  const removeItem = (id) => {
    dispatch({ type: "REMOVE", payload: id });
  };
  
  const increase = (id) => {
    dispatch({ type: "INCREASE", payload: id });
    console.log('increase')
  };

  const decrease = (id) => {
    dispatch({ type: "DECREASE", payload: id });
    console.log('decrease')
  };

  const fetchData = async () => {
    dispatch({ type: "LOADING" });
    dispatch({ type: "DISPLAY_ITEMS", payload: cart });
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    dispatch({ type: "GET_TOTALS" });
  }, [state.cart]);

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
