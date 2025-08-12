import ProductList from "../component/ProductList";
import { useLocation } from "react-router-dom";

function Product() {
  const location = useLocation();

  return (
    <div>
      <ProductList key={location.pathname} />
    </div>
  );
}

export default Product;
