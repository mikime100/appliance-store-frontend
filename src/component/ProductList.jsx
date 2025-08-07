import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../store/cart";
import { FaComment } from "react-icons/fa";
import TruncatedText from "./TruncatedText";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [explore, setExplore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  function handleExplore(e) {
    e.preventDefault();
    setExplore(!explore);
  }

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.modelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine which products to show based on explore state
  const productsToShow = explore
    ? filteredProducts.slice(0, 8)
    : filteredProducts;

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="w-full px-4 pt-8 sm:px-6 md:max-w-[1100px] mx-auto">
      <div className="flex  justify-between items-center pt-12 sm:pt-24 mb-8 sm:mb-10 gap-4 sm:gap-0">
        <h1 className="font-extrabold sm:font-bold text-1xl sm:text-4xl">
          Our Products
        </h1>
        <div>
          <input
            className="border-2 rounded-lg px-4 focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300 w-full sm:w-60 py-2 text-sm"
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {productsToShow.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg">No products found matching your search.</p>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {productsToShow.map((item) => (
              <ManItem key={item._id} item={item} />
            ))}
          </ul>

          {filteredProducts.length > 8 && (
            <div className="flex justify-center mt-8 sm:mt-10">
              <button
                onClick={handleExplore}
                className="bg-yellow-400 py-2 px-8 sm:py-3 sm:px-10 text-lg sm:text-xl rounded-3xl text-black font-bold hover:bg-yellow-500 transition-colors"
              >
                {explore ? "Explore More" : "See Less"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ManItem({ item }) {
  const dispatch = useDispatch();
  return (
    <li className="p-4 cursor-pointer rounded-3xl mx-10 sm:mx-0 md:mx-o hover:bg-slate-200 hover:scale-105 transition-all duration-300 ease-in-out hover:text-slate-600 bg-[#e9ecef] shadow-lg hover:shadow-xl flex flex-col h-[400px]">
      {/* Top section - Image and title */}
      <div className="flex-shrink-0">
        <div className="flex justify-center mb-2">
          <img
            className="w-full max-w-[200px] h-auto aspect-square object-contain"
            src={item.imageUrl}
            alt={item.modelName}
          />
        </div>
        <h1 className="font-bold text-lg mb-2">{item.modelName}</h1>
      </div>

      {/* Middle section - Description (flexible) */}
      <div className="flex-1 min-h-0 mb-2">
        <TruncatedText
          text={item.description}
          productId={item._id}
          className="font-thin text-sm"
          maxLines={3}
        />
      </div>

      {/* Bottom section - Price and action buttons (always at bottom) */}
      <div className="flex-shrink-0 space-y-2">
        <div className="font-bold">
          <span className="pr-1">Price:</span>
          <span className="pr-2">${item.price}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-2">
            <button
              onClick={() => dispatch(addItem(item))}
              className="bg-[#101429] py-1 px-3 rounded-3xl text-white font-bold hover:bg-[#101429]/80 w-full"
            >
              ADD
            </button>
            <Link
              to={`/product/${item._id}`}
              className="bg-[#101429] py-1 px-3 rounded-3xl text-white font-bold hover:bg-[#101429]/80 w-full text-center"
            >
              Detail
            </Link>
          </div>
          <Link
            to={`/product/${item._id}#comments`}
            className="bg-[#101429] py-1 px-3 rounded-3xl text-white font-bold hover:bg-[#101429]/80 w-full text-center transition-colors flex items-center justify-center gap-1"
          >
            <FaComment className="text-xs" />
            Comment
          </Link>
        </div>
      </div>
    </li>
  );
}

export default ProductList;
