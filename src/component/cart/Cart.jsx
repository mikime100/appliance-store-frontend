import React from "react";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  clearCart,
  getTotalPrice,
  getTotalQuantity,
} from "../../store/cart";
import { FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => getCart(state));
  const totalPrice = useSelector((state) => getTotalPrice(state));
  const totalQuantity = useSelector((state) => getTotalQuantity(state));
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart.length > 0
              ? `${totalQuantity} item${
                  totalQuantity !== 1 ? "s" : ""
                } in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items - Takes 2/3 of the space */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </div>
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors text-sm sm:text-base"
                  >
                    <FaTrash className="w-4 h-4" />
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary - Takes 1/3 of the space */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:sticky lg:top-24">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Summary
                  </h2>
                </div>
                <div className="px-4 sm:px-6 py-4 space-y-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">
                      Total ({totalQuantity} items)
                    </span>
                    <span className="font-medium">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
                  <div className="text-center">
                    <Link
                      to="/product"
                      className="flex items-center justify-center gap-2 bg-[#101429] text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base font-medium"
                    >
                      <FaArrowLeft className="w-4 h-4" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet. Start
                shopping to see some great deals!
              </p>
              <Link
                to="/product"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <FaShoppingCart className="w-4 h-4" />
                Start Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
