import data from "./data";

const reducer = (state, action) => {
  if (action.type === "REMOVE") {
    let tempCart = state.cart.filter(
      (cartItem) => cartItem.id !== action.payload
    );
    return { ...state, cart: tempCart };
  }

  if (action.type === "ADD") {
    const newCartItem = data.find((item) => item.id === action.payload);

    if (!newCartItem) return state; // guard if item not found

    if (state.cart.some((item) => item.id === newCartItem.id)) {
      // if item already exists in cart, return current state
      return state;
    }

    const updatedCart = [...state.cart, newCartItem]; // create new array

    return { ...state, cart: updatedCart };
  }

  if (action.type === "INCREASE") {
    let tempCart = state.cart.map((cartItem) => {
      if (cartItem.id === action.payload) {
        return { ...cartItem, amount: cartItem.amount + 1 };
      }
      return cartItem;
    });

    return { ...state, cart: tempCart };
  }

  if (action.type === "DECREASE") {
    let tempCart = state.cart
      .map((cartItem) => {
        if (cartItem.id === action.payload) {
          return { ...cartItem, amount: cartItem.amount - 1 };
        }
        return cartItem;
      })
      .filter((cartItem) => cartItem.amount !== 0);

    return { ...state, cart: tempCart };
  }
// Get total price of items in the cart
  if (action.type === "GET_TOTALS") {
    let { subtotal, noOfItems } = state.cart.reduce(
      (cartTotal, cartItem) => {
        const { amount, price } = cartItem;
        cartTotal.noOfItems += amount;
        cartTotal.subtotal += amount * price;
        return cartTotal;
      },
      { subtotal: 0, noOfItems: 0 }
    );

    subtotal = parseFloat(subtotal.toFixed(2));
    return { ...state, noOfItems, subtotal };
  }

  if (action.type === "LOADING") {
    return { ...state, loading: true };
  }

  if (action.type === "DISPLAY_ITEMS") {
    return { ...state, cart: action.payload, loading: false };
  }

  throw new Error(" No matching dispatch");
};

export default reducer;
