import { useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity } from "../store/cart";
function UpdateCart({ id, currentQuantity }) {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <button type="round" onClick={() => dispatch(decreaseQuantity(id))}>
        -
      </button>
      <span className="text-sm font-medium">{currentQuantity}</span>
      <button type="round" onClick={() => dispatch(increaseQuantity(id))}>
        +
      </button>
    </div>
  );
}

export default UpdateCart;
