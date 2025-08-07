import React from "react";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import { getCart, clearCart } from "../../store/cart";

const Cart = () => {
  const cart = useSelector((state) => getCart(state));
  const dispatch = useDispatch();
  return (
    <>
      {cart.length > 0 && (
        <div className="py-4  px-3">
          <h2 className="mt-7 text-xl font-semibold">Your cart</h2>
          <ul className="divide-y divide-stone-300 border-b mt-3">
            {cart.map((item) => {
              return <CartItem key={item._id} item={item} />;
            })}
          </ul>
          <div className="mt-6 space-x-2">
            <button type="secondary" onClick={() => dispatch(clearCart())}>
              Clear cart
            </button>
          </div>
        </div>
      )}
      {cart.length === 0 && (
        <h1 className="align-middle text-center text-2xl font-semibold">
          No product yet
        </h1>
      )}
    </>
  );
};

export default Cart;
