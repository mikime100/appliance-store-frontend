import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { addItem } from "../store/cart";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { FaComment } from "react-icons/fa";
import TruncatedText from "./TruncatedText";

function HomeProduct() {
  const [products, setProducts] = useState([]);
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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  // Get products for display
  const homeProducts = products.slice(0, 5);

  return (
    <div
      className="w-full px-5 sm:px-6 md:max-w-[1400px] mx-auto relative pt-20 min-h-screen"
      style={{ backgroundColor: "#FEFEFF" }}
    >
      {/* DIV 2 - Brand/Heading */}
      <div className="mb-8 relative">
        <h1 className="text-2xl font-bold text-gray-800">YQL APPLIANCE</h1>
      </div>

      {/* DIV 3 - Hero Image */}
      <div
        className="text-center py-8 mb-8 rounded-2xl p-6 relative overflow-hidden min-h-[500px]"
        style={{ backgroundColor: "#023047" }}
      >
        <img
          src={require("./images/open-kitchen1.png")}
          alt="Open Kitchen"
          className="w-full h-full object-cover absolute inset-0"
          style={{
            filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.25))",
            transform: "translateZ(30px)",
          }}
        />

        {/* Text Overlay */}
        <div className="absolute inset-0">
          {/* Header and Paragraph Container */}
          <div className="relative z-20 ml-[55px] max-w-md p-11">
            <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-white mb-2 whitespace-nowrap">
              Transform Your Space with Premium Appliances
            </h2>

            {/* Paragraph */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-[30px] py-2 shadow-lg w-[1000px] ml-[125px] mt-[45px]">
              <p className="font-light text-base md:text-lg text-gray-200 leading-relaxed">
                Modern design, unmatched quality. Discover smart, stylish
                kitchen essentials and washer/dryer machines built to last. From
                compact solutions for small spaces to full-featured appliances
                for busy homes, our handpicked selection combines performance,
                efficiency, and affordability—so you can upgrade your lifestyle
                with ease. Whether you're cooking, cleaning, or organizing,
                every appliance is designed to simplify your day and elevate
                your home.
              </p>
            </div>
          </div>

          {/* Shop Now Button */}
          <div className="relative z-20 flex items-start ml-[585px] mt-[20px]">
            <Link to="/product">
              <button className="bg-[#fb8500] hover:bg-[#fb8500]/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* DIV 4 - Hero Text Block */}
      <div className="text-center mb-8 relative py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          YQL Appliances
        </h2>
        <p className="text-gray-600">
          Shop our range of refurbished and brand new appliances.
        </p>
      </div>

      {/* DIV 5 - Horizontal Auto Scroll Product Carousel */}
      <div className="mb-16 relative">
        <HorizontalAutoScrollProductCarousel products={homeProducts} />
      </div>

      {/* DIV 6 - Footer */}
      <div
        className="text-center py-6 border-t border-gray-300 relative rounded-lg mt-8"
        style={{ backgroundColor: "#023047" }}
      >
        <div className="flex justify-center space-x-6 text-sm text-gray-200">
          <Link to="/about" className="hover:text-white">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-white">
            Contact
          </Link>
          <Link to="/faq" className="hover:text-white">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}

function HorizontalAutoScrollProductCarousel({ products }) {
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const productListRef = useRef(null);
  const animationRef = useRef(null);

  // Duplicate products for seamless loop
  const duplicatedProducts = [...products, ...products];

  const getProductKey = (product, index) => `${product._id}-${index}`;

  // Initialize GSAP animation
  useEffect(() => {
    if (!productListRef.current || products.length === 0) return;

    // Calculate the width of one set of products
    const productWidth = 320; // w-80 = 320px
    const gap = 16; // gap-4 = 16px
    const totalWidth = products.length * (productWidth + gap);

    // Create the infinite scroll animation
    animationRef.current = gsap.to(productListRef.current, {
      x: -totalWidth,
      duration: totalWidth / 50, // Adjust speed here (50px per second)
      ease: "none",
      repeat: -1, // Infinite repeat
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [products]);

  // Pause/resume animation on hover
  useEffect(() => {
    if (animationRef.current) {
      if (isPaused) {
        animationRef.current.pause();
      } else {
        animationRef.current.resume();
      }
    }
  }, [isPaused]);

  return (
    <div
      className="relative h-[500px] p-4 rounded-lg overflow-hidden"
      style={{ backgroundColor: "#023047" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient fade edges */}
      <div
        className="absolute left-0 top-0 w-16 h-full z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #023047 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 w-16 h-full z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to left, #023047 0%, transparent 100%)",
        }}
      />

      {/* GSAP-powered carousel container */}
      <div ref={carouselRef} className="h-full overflow-hidden">
        <div
          ref={productListRef}
          className="flex gap-4 h-full"
          style={{ width: "max-content" }}
        >
          {duplicatedProducts.map((product, index) => (
            <div
              key={getProductKey(product, index)}
              className="flex-shrink-0 w-80"
            >
              <ProductCard item={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item, index }) {
  const dispatch = useDispatch();

  return (
    <div
      className="bg-[#e9ecef] rounded-lg shadow-lg p-4 hover:shadow-2xl hover:border-2 hover:border-[#fb8500] transition-all duration-300 hover:-translate-y-1 relative h-[26rem] flex flex-col"
      style={{
        transform: `translateZ(${20 + index * 3}px)`,
        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
      }}
    >
      {/* Top section - Image and title */}
      <div className="flex-shrink-0">
        <div className="flex justify-center mb-4">
          <img
            src={item.imageUrl}
            alt={item.modelName}
            className="w-32 h-32 object-contain"
          />
        </div>
        <h3 className="font-bold text-lg text-center mb-2">{item.modelName}</h3>
      </div>

      {/* Middle section - Description (flexible) */}
      <div className="flex-1 min-h-0">
        <div className="text-gray-600 text-sm text-center mb-4">
          <TruncatedText
            text={item.description}
            productId={item._id}
            maxLines={3}
          />
        </div>
      </div>

      {/* Bottom section - Price and action buttons (always at bottom) */}
      <div className="flex-shrink-0 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl">${item.price}</span>
          <button
            onClick={() => dispatch(addItem(item))}
            className="bg-[#101429] py-2 px-4 rounded-3xl text-white font-bold hover:bg-[#101429]/80 transition-colors shadow-lg"
          >
            Add
          </button>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/product/${item._id}`}
            className="bg-[#101429] py-1 px-3 rounded-3xl text-white font-bold hover:bg-[#101429]/80 transition-colors shadow-lg text-center flex-1 text-sm"
          >
            Detail
          </Link>
          <Link
            to={`/product/${item._id}#comments`}
            className="bg-[#101429] py-1 px-3 rounded-3xl text-white font-bold hover:bg-[#101429]/80 transition-colors shadow-lg text-center flex-1 text-sm flex items-center justify-center gap-1"
          >
            <FaComment className="text-xs" />
            Comment
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeProduct;
