import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const productIndex = state.cart.findIndex(
        (items) => items._id === action.payload._id
      );
      if (productIndex === -1) {
        state.cart.push({
          ...action.payload,
          quantity: 1,
          totalPrice: action.payload.price,
        });
      } else {
        const newCart = state.cart;
        newCart[productIndex].quantity++;
        newCart[productIndex].totalPrice =
          newCart[productIndex].price * newCart[productIndex].quantity;
        state.cart = [...newCart];
      }
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter((items) => items._id !== action.payload);
    },
    increaseQuantity(state, action) {
      const itemIndex = state.cart.findIndex(
        (items) => items._id === action.payload
      );
      state.cart[itemIndex].quantity++;
      state.cart[itemIndex].totalPrice =
        state.cart[itemIndex].quantity * state.cart[itemIndex].price;
    },
    decreaseQuantity(state, action) {
      const itemIndex = state.cart.findIndex(
        (items) => items._id === action.payload
      );
      let quantity = state.cart[itemIndex].quantity;
      if (quantity === 1) cartSlice.caseReducers.deleteItem(state, action);
      else {
        quantity--;
        state.cart[itemIndex].quantity = quantity;
        state.cart[itemIndex].totalPrice =
          quantity * state.cart[itemIndex].price;
      }
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
export const getCart = (state) => state.cart.cart;
export const getTotalQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);
export const getTotalPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);
export const getCurrentQuantityById = (id) => (state) =>
  state.cart.cart.find((item) => item._id === id)?.quantity ?? 0;
