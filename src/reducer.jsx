const clampAmount = (amount) => Math.min(99, Math.max(1, Number(amount) || 1));

const reducer = (state, action) => {
  if (action.type === "REMOVE") {
    const tempCart = state.cart.filter(
      (cartItem) => cartItem.id !== action.payload
    );
    return { ...state, cart: tempCart };
  }

  if (action.type === "ADD") {
    const product = action.payload;

    if (!product || product.id === undefined) return state;

    const existingItem = state.cart.find((item) => item.id === product.id);

    if (existingItem) {
      const tempCart = state.cart.map((item) =>
        item.id === product.id
          ? { ...item, amount: clampAmount(item.amount + 1) }
          : item
      );
      return { ...state, cart: tempCart };
    }

    const newCartItem = { ...product, amount: clampAmount(product.amount || 1) };
    return { ...state, cart: [...state.cart, newCartItem] };
  }

  if (action.type === "INCREASE") {
    const tempCart = state.cart.map((cartItem) => {
      if (cartItem.id === action.payload) {
        return { ...cartItem, amount: clampAmount(cartItem.amount + 1) };
      }
      return cartItem;
    });

    return { ...state, cart: tempCart };
  }

  if (action.type === "DECREASE") {
    const tempCart = state.cart
      .map((cartItem) => {
        if (cartItem.id === action.payload) {
          return { ...cartItem, amount: cartItem.amount - 1 };
        }
        return cartItem;
      })
      .filter((cartItem) => cartItem.amount > 0);

    return { ...state, cart: tempCart };
  }

  if (action.type === "GET_TOTALS") {
    const { subtotal, noOfItems } = state.cart.reduce(
      (cartTotal, cartItem) => {
        const { amount, price } = cartItem;
        cartTotal.noOfItems += amount;
        cartTotal.subtotal += amount * price;
        return cartTotal;
      },
      { subtotal: 0, noOfItems: 0 }
    );

    return {
      ...state,
      noOfItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
    };
  }

  if (action.type === "LOADING") {
    return { ...state, loading: true };
  }

  if (action.type === "STOP_LOADING") {
    return { ...state, loading: false };
  }

  if (action.type === "HYDRATE") {
    return {
      ...state,
      cart: Array.isArray(action.payload) ? action.payload : [],
      loading: false,
    };
  }

  if (action.type === "CLEAR") {
    return {
      ...state,
      cart: [],
      subtotal: 0,
      noOfItems: 0,
      loading: false,
    };
  }

  throw new Error(`No matching dispatch: ${action.type}`);
};

export default reducer;
