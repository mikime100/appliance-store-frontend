import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
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
  const location = useLocation();

  useEffect(() => {
    // Reset state when component mounts or location changes
    setLoading(true);
    setError(null);
    setProducts([]);

    axios
      .get(API_ENDPOINTS.PRODUCTS)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, [location.pathname]); // Re-run when pathname changes

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
    <div className="w-full px-4 pt-8 pb-12 sm:px-6 sm:pb-16 md:max-w-[1100px] mx-auto">
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
          <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
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

  const truncateName = (name, max = 40) => {
    if (!name) return "";
    return name.length > max ? name.slice(0, max - 1) + "…" : name;
  };

  return (
    <li className="p-0 sm:p-4 cursor-pointer rounded-2xl sm:rounded-3xl mx-0 sm:mx-0 hover:bg-slate-200 sm:hover:scale-105 transition-all duration-300 ease-in-out hover:text-slate-600 bg-transparent sm:bg-[#e9ecef] shadow-none sm:shadow-lg sm:hover:shadow-xl flex flex-col sm:h-[480px]">
      {/* Mobile card (small screens) */}
      <Link to={`/product/${item._id}`} className="block sm:hidden w-full">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <img
            className="w-full aspect-square object-cover"
            src={item.imageUrl}
            alt={item.modelName}
          />
          <div className="p-3">
            <div className="text-[15px] font-bold text-gray-900 mb-1">
              ${item.price}
            </div>
            <h2 className="text-[13px] font-medium text-gray-800 leading-snug">
              {truncateName(item.modelName, 50)}
            </h2>
          </div>
        </div>
      </Link>

      {/* Desktop and larger (unchanged) */}
      <div className="hidden sm:block">
        {/* Top section - Image and title */}
        <div className="flex-shrink-0 mb-3">
          <div className="flex justify-center mb-3 h-[200px] overflow-hidden">
            <img
              className="h-full w-[260px] lg:w-[300px] object-cover"
              src={item.imageUrl}
              alt={item.modelName}
            />
          </div>
          <h1 className="font-bold text-lg mb-3">{item.modelName}</h1>
        </div>

        {/* Middle section - Description (flexible) */}
        <div className="mb-4">
          <div className="max-h-28 overflow-hidden">
            <TruncatedText
              text={item.description}
              productId={item._id}
              className="font-thin text-sm"
              maxLines={3}
            />
          </div>
        </div>

        {/* Bottom section - Price and action buttons (always at bottom) */}
        <div className="space-y-3 pb-2">
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
      </div>
    </li>
  );
}

export default ProductList;
