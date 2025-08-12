import { useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity } from "../store/cart";

function UpdateCart({ id, currentQuantity }) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={() => dispatch(decreaseQuantity(id))}
        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-semibold"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="w-12 h-10 flex items-center justify-center bg-white text-gray-900 font-semibold border-x border-gray-300">
        {currentQuantity}
      </span>
      <button
        onClick={() => dispatch(increaseQuantity(id))}
        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-semibold"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default UpdateCart;
