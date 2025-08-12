import { Link } from "react-router-dom";
function EmptyCart() {
  return (
    <div className="px-4 py-3">
      <Link to="/product">&larr; Back to menu</Link>
      <p className="font-semibold mt-7">
        Your cart is still empty. Start adding some pizzas :)
      </p>
    </div>
  );
}

export default EmptyCart;
