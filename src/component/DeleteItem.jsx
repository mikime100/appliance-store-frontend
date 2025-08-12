import { useDispatch } from "react-redux";
import { deleteItem } from "../store/cart";
import { FaTrash } from "react-icons/fa";

function DeleteItem({ id }) {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(deleteItem(id))}
      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
      aria-label="Remove item from cart"
    >
      <FaTrash className="w-4 h-4" />
    </button>
  );
}

export default DeleteItem;
