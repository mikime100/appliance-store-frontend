import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { addItem } from "../store/cart";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaComment, FaCheck } from "react-icons/fa";
import TruncatedText from "./TruncatedText";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { gsap } from "gsap";

function HomeProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  // Get products for display
  const homeProducts = products.slice(0, 5);

  return (
    <div
      className="w-full px-5 sm:px-6 md:max-w-[1400px] mx-auto relative pt-20 min-h-screen grid grid-cols-1 gap-8"
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
        {/* Desktop Image */}
        <img
          src={require("./images/open-kitchen1.png")}
          alt="Open Kitchen"
          className="hidden md:block w-full h-full object-cover absolute inset-0"
          style={{
            filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.25))",
            transform: "translateZ(30px)",
          }}
        />

        {/* Mobile Image */}
        <img
          src={require("./images/small_screen_kitchen.png")}
          alt="Open Kitchen"
          className="md:hidden w-full h-full object-cover absolute inset-0"
          style={{
            filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.25))",
            transform: "translateZ(30px)",
          }}
        />

        {/* Mobile Text Overlay (only mobile) */}
        <div className="absolute inset-0 grid grid-cols-1 gap-3 p-4 md:hidden">
          {/* Header */}
          <div className="relative z-20 ml-0 max-w-full p-4">
            <h2 className="font-bold text-xl text-white mb-2">
              Transform Your Space with Premium Appliances
            </h2>
          </div>

          {/* Paragraph */}
          <div className="rounded-lg px-4 py-2 w-full ml-0 mt-2">
            <p
              className="font-semibold text-base text-white leading-relaxed"
              style={{
                textShadow:
                  "0 4px 12px rgba(0,0,0,0.95), 0 8px 24px rgba(0,0,0,0.85), 0 16px 48px rgba(0,0,0,0.8)",
              }}
            >
              Modern design, unmatched quality. Discover smart, stylish kitchen
              essentials and washer/dryer machines built to last
            </p>
          </div>

          {/* Button */}
          <div className="relative z-20 flex items-start ml-0 mt-3 justify-center">
            <Link to="/product">
              <button className="bg-[#fb8500] hover:bg-[#fb8500]/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                Shop Now
              </button>
            </Link>
          </div>
        </div>

        {/* Desktop Text Overlay (md and up) - restored */}
        <div className="absolute inset-0 hidden md:flex flex-col items-start justify-center px-16">
          <h2 className="font-bold text-5xl text-white mb-6">
            Transform Your Space with Premium Appliances
          </h2>
          <div className="max-w-2xl">
            <p
              className="text-lg text-white font-semibold"
              style={{
                textShadow:
                  "0 4px 12px rgba(0,0,0,0.95), 0 8px 24px rgba(0,0,0,0.85), 0 16px 48px rgba(0,0,0,0.8)",
              }}
            >
              Modern design, unmatched quality. Discover smart, stylish kitchen
              essentials and washer/dryer machines built to last.
            </p>
          </div>
          <div className="mt-8">
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
  const autoplay = useRef(
    Autoplay({
      delay: 2500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true,
    })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [autoplay.current]
  );

  // Desktop GSAP refs/state
  const [isMobile, setIsMobile] = useState(false);
  const marqueeListRef = useRef(null);
  const marqueeAnimRef = useRef(null);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Desktop marquee init
  useEffect(() => {
    if (isMobile) return;
    if (!marqueeListRef.current || products.length === 0) return;

    const productWidth = 320; // w-80
    const gap = 16; // gap-4
    const totalWidth = products.length * (productWidth + gap);

    marqueeAnimRef.current = gsap.to(marqueeListRef.current, {
      x: -totalWidth,
      duration: totalWidth / 50,
      ease: "none",
      repeat: -1,
    });

    return () => {
      if (marqueeAnimRef.current) marqueeAnimRef.current.kill();
    };
  }, [products, isMobile]);

  const getProductKey = (product, index) => `${product._id}-${index}`;

  // Start autoplay when ready and control on drag/touch
  useEffect(() => {
    if (!emblaApi) return;
    autoplay.current.play();
    const stop = () => autoplay.current.stop();
    const reset = () => autoplay.current.reset();
    emblaApi.on("pointerDown", stop);
    emblaApi.on("pointerUp", reset);
    emblaApi.on("dragStart", stop);
    emblaApi.on("dragEnd", reset);
    return () => {
      emblaApi.off("pointerDown", stop);
      emblaApi.off("pointerUp", reset);
      emblaApi.off("dragStart", stop);
      emblaApi.off("dragEnd", reset);
    };
  }, [emblaApi]);

  return (
    <div
      className="relative h-[510px] md:h-[570px] p-4 pb-[30px] rounded-lg overflow-hidden"
      style={{ backgroundColor: "#023047" }}
      onMouseEnter={() => {
        if (isMobile) autoplay.current.stop();
        else if (marqueeAnimRef.current) marqueeAnimRef.current.pause();
      }}
      onMouseLeave={() => {
        if (isMobile) autoplay.current.reset();
        else if (marqueeAnimRef.current) marqueeAnimRef.current.resume();
      }}
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

      {isMobile ? (
        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full gap-4 pr-4">
            {products.map((product, index) => (
              <div
                key={getProductKey(product, index)}
                className="flex-shrink-0 w-80"
              >
                <ProductCard item={product} index={index} />
              </div>
            ))}
            {/* Spacer to separate last and first slides in loop */}
            <div className="flex-shrink-0 w-4" aria-hidden="true" />
          </div>
        </div>
      ) : (
        <div className="h-full overflow-hidden">
          <div
            ref={marqueeListRef}
            className="flex gap-4 h-full"
            style={{ width: "max-content" }}
          >
            {[...products, ...products].map((product, index) => (
              <div
                key={getProductKey(product, index)}
                className="flex-shrink-0 w-80"
              >
                <ProductCard item={product} index={index} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ item, index }) {
  const dispatch = useDispatch();

  return (
    <div
      className="bg-[#e9ecef] rounded-lg shadow-lg p-4 hover:shadow-2xl hover:border-2 hover:border-[#fb8500] transition-all duration-300 hover:-translate-y-1 relative h-[460px] md:h-[520px] flex flex-col"
      style={{
        transform: `translateZ(${20 + index * 3}px)`,
        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
      }}
    >
      {/* Top section - Image and title */}
      <div className="flex-shrink-0">
        <div className="flex justify-center mb-4">
          {/* Enlarged, square-cropped image with rounded corners */}
          <div className="w-52 h-52 md:w-60 md:h-60 rounded-2xl overflow-hidden bg-white/20">
            <img
              src={item.imageUrl}
              alt={item.modelName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h3 className="font-bold text-lg text-center mb-2 px-2 leading-snug truncate whitespace-nowrap">
          {item.modelName}
        </h3>
      </div>

      {/* Middle section - Description (no flex growth to avoid big gaps) */}
      <div className="px-2 mb-1 md:mb-3">
        <div className="text-gray-600 text-sm text-center overflow-hidden">
          <TruncatedText
            text={item.description}
            productId={item._id}
            maxLines={2}
          />
        </div>
      </div>

      {/* Bottom section - Price and action buttons */}
      <div className="mt-0 md:mt-auto">
        <div className="mt-1 md:-mt-[10px]">
          <div className="flex justify-between items-center mb-2">
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
    </div>
  );
}

export default HomeProduct;
