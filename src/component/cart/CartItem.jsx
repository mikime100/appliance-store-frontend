import React from "react";
import UpdateCart from "../UpdateCart";
import DeleteItem from "../DeleteItem";
import { FaTrash } from "react-icons/fa";

const CartItem = ({ item }) => {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            className="w-20 h-20 rounded-lg object-cover border border-gray-200"
            src={item.imageUrl}
            alt={item.modelName}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {item.modelName}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Condition: {item.condition || "A"}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Quantity Controls */}
                  <UpdateCart id={item._id} currentQuantity={item.quantity} />

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${item.totalPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <div className="flex-shrink-0">
                  <DeleteItem id={item._id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
