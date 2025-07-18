const reducer = (state, action) => {

  if (action.type === "REMOVE") {
    let tempCart = state.cart.filter(
      (cartItem) => cartItem.id !== action.payload
    );
    return { ...state, cart: tempCart };
  }

//   if (action.type === "INCREASE") {
//     let tempCart = state.cart.map((cartItem) => {
//       if (cartItem.id === action.payload) {
//         return { ...cartItem, amount: cartItem.amount + 1 };
//       }
//       return cartItem;
//     });

//     return { ...state, cart: tempCart };
//   }

//   if (action.type === "DECREASE") {
//     let tempCart = state.cart
//       .map((cartItem) => {
//         if (cartItem.id === action.payload) {
//           return { ...cartItem, amount: cartItem.amount - 1 };
//         }
//         return cartItem;
//       })
//       .filter((cartItem) => cartItem.amount !== 0);

//     return { ...state, cart: tempCart };
//   }

//   if (action.type === "GET_TOTALS") {
//     let { total, amount } = state.cart.reduce(
//       (cartTotal, cartItem) => {
//         const { amount, price } = cartItem;
//         cartTotal.amount += amount;
//         cartTotal.total += amount * price;
//         return cartTotal;
//       },
//       { total: 0, amount: 0 }
//     );

//     total = parseFloat(total.toFixed(2));
//     return { ...state, amount, total };
//   }

//   if (action.type === "LOADING") {
//     return { ...state, loading: true };
//   }

//   if (action.type === "DISPLAY_ITEMS") {
//     return { ...state, cart: action.payload, loading: false };
//   }

  throw new Error(" No matching dispatch");
};

export default reducer;
