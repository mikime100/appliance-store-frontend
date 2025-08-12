import React, { useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { getCart, getTotalQuantity } from "../store/cart";
import {
  PRIMARY,
  SECONDARY,
  BG_LIGHT,
  BG_CARD,
  ACCENT,
  BUTTON_NEUTRAL,
  HEADING_TEXT,
} from "../theme";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const cart = useSelector((state) => getTotalQuantity(state));

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : original || "";
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [isOpen]);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 text-white"
      style={{ backgroundColor: "#03071e" }}
    >
      {/* Mobile top bar */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={require("../component/images/YQL LOGO.png")}
            alt="YQL Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="text-xl font-bold">YQL APPLIANCES</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative"
            onClick={() => setIsOpen(false)}
          >
            <FaCartShopping className="w-7 h-7" />
            {cart !== 0 && (
              <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-yellow-300 text-black text-xs font-bold flex items-center justify-center">
                {cart}
              </span>
            )}
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <FiMenu className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Desktop bar (unchanged theme) */}
      <div className="hidden md:flex items-center justify-between px-6 lg:px-24 py-2">
        <Link to="/" className="flex items-center gap-3 mr-auto">
          <img
            src={require("../component/images/YQL LOGO.png")}
            alt="YQL Logo"
            className="h-12 w-auto object-contain"
          />
          <span className="text-2xl font-bold">YQL APPLIANCES</span>
        </Link>

        <ul className="flex items-center gap-10">
          <li>
            <Link
              to="/"
              className="font-medium hover:text-gray-300 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/product"
              className="font-medium hover:text-gray-300 transition-colors"
            >
              Product
            </Link>
          </li>

          <li className="relative">
            <Link to="/cart" className="flex items-center gap-2">
              <FaCartShopping className="w-6 h-6" />
            </Link>
            {cart !== 0 && (
              <span className="absolute -top-2 -right-3 min-w-[20px] h-[20px] px-1 rounded-full bg-yellow-300 text-black text-xs font-bold flex items-center justify-center">
                {cart}
              </span>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          {/* Panel */}
          <nav
            className={`fixed inset-y-0 right-0 z-50 w-4/5 max-w-xs bg-[#03071e] text-white p-6 transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={require("../component/images/YQL LOGO.png")}
                  alt="YQL Logo"
                  className="h-8 w-auto object-contain"
                />
                <span className="text-lg font-semibold">YQL APPLIANCES</span>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <FiX className="w-7 h-7" />
              </button>
            </div>

            <ul className="space-y-4">
              <li>
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/"
                  className="block text-lg font-medium py-3 px-2 rounded-md hover:bg-white/10"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/product"
                  className="block text-lg font-medium py-3 px-2 rounded-md hover:bg-white/10"
                >
                  Product
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/cart"
                  className="block text-lg font-medium py-3 px-2 rounded-md hover:bg-white/10"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavBar;
