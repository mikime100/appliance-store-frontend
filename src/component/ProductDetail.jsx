import star_icon from "./images/star_icon.png";
import dual_star_icon from "./images/star_dull_icon.png";
import { addItem } from "../store/cart";
import { useParams, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import CommentSystem from "./CommentSystem/CommentSystem";
import { FaArrowLeft, FaHeart, FaStar, FaChevronUp } from "react-icons/fa";

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState("A");
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();
  const commentsRef = useRef(null);

  useEffect(() => {
    axios
      .get(API_ENDPOINTS.PRODUCT_BY_ID(id))
      .then((res) => {
        setItem(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Product not found");
        setLoading(false);
      });
  }, [id]);

  // Load related products (simple heuristic: first 8 excluding current)
  useEffect(() => {
    axios
      .get(API_ENDPOINTS.PRODUCTS)
      .then((res) => {
        const others = (res.data || []).filter(
          (p) => String(p._id) !== String(id)
        );
        setRelated(others.slice(0, 8));
      })
      .catch(() => {});
  }, [id]);

  // Scroll to comments section if URL contains #comments
  useEffect(() => {
    if (location.hash === "#comments" && commentsRef.current) {
      setTimeout(() => {
        commentsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);
    }
  }, [location.hash, item]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !item)
    return (
      <div className="text-center py-10 text-red-500">
        {error || "Product not found"}
      </div>
    );

  const images = [item.imageUrl, item.imageUrl, item.imageUrl, item.imageUrl]; // In real app, you'd have multiple images
  const conditions = ["A", "B", "C"];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/product" className="flex items-center hover:text-gray-800">
            <FaArrowLeft className="mr-2" />
            Products
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Section - Product Images */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="relative flex justify-center bg-gray-100 rounded-lg p-4">
              <img
                src={images[selectedImage]}
                className="max-w-full max-h-96 object-contain rounded-lg"
                alt={item.modelName}
              />
            </div>

            {/* Product Thumbnails */}
            <div className="flex space-x-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-gray-100 ${
                    selectedImage === index
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    className="max-w-full max-h-full object-contain"
                    alt={`${item.modelName} ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Section - Product Details */}
          <div className="space-y-6">
            {/* Category Tag */}
            <div className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              YQL Appliances
            </div>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {item.modelName}
            </h1>

            {/* Price */}
            <div className="text-2xl font-bold text-gray-900">
              ${item.price}
            </div>

            {/* Condition Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Condition</h3>
              <div className="flex space-x-3">
                <button
                  className={`w-12 h-12 rounded-full border-2 font-medium transition-all ${
                    item.condition === "A"
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  A
                </button>
                <button
                  className={`w-12 h-12 rounded-full border-2 font-medium transition-all ${
                    item.condition === "B"
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  B
                </button>
                <button
                  className={`w-12 h-12 rounded-full border-2 font-medium transition-all ${
                    item.condition === "C"
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  C
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                A: Excellent, B: Good, C: Fair
              </p>
            </div>

            {/* Add to Cart */}
            <div className="flex">
              <button
                onClick={() => dispatch(addItem(item))}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
            </div>

            {/* Description & Specifications Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between cursor-pointer">
                <h3 className="font-semibold text-gray-900">
                  Description & Specifications
                </h3>
                <FaChevronUp className="text-gray-400" />
              </div>
              <div className="mt-4 text-gray-600 leading-relaxed">
                {item.description}
              </div>
            </div>
          </div>
        </div>

        {/* Rating & Reviews Section */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Customer Reviews
          </h2>
          <div className="mb-8">
            <CommentSystem
              productId={id}
              isAdmin={false}
              autoShowForm={location.hash === "#comments"}
            />
          </div>
        </div>

        {/* You might also like section */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            You might also like
          </h2>
          {related.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <li
                  key={p._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/product/${p._id}`} className="block">
                    <div className="bg-gray-100">
                      <img
                        src={p.imageUrl}
                        alt={p.modelName}
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-[15px] font-bold text-gray-900 mb-1">
                        ${p.price}
                      </div>
                      <h3 className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2">
                        {p.modelName}
                      </h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No related products available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
