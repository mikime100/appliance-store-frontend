import { useDispatch } from "react-redux";
import { deleteItem } from "../store/cart";

function DeleteItem({ id }) {
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch(deleteItem(id))} type="small">
      Delete
    </button>
  );
}

export default DeleteItem;
