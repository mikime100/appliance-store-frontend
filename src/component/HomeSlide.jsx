import heroImage from "./images/final fridge1.png";
import backgroundImage from "./images/DIV-1-background.png";
import smallHeroImage from "./images/small_hero_page.png";
import { Link } from "react-router-dom";
function HomeSlide() {
  return (
    <div className="w-full pt-4 sm:pt-8 md:pt-12 lg:pt-16 relative">
      {/* Mobile Design - Using background image like desktop */}
      <div
        className="md:hidden grid grid-cols-1 justify-center px-6 py-8 relative"
        style={{
          backgroundImage: `url(${smallHeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          height: "calc(120vh + 115px)",
        }}
      >
        {/* Mobile Headline - Top Right Corner - Independent Container */}
        <div className="relative z-10 flex justify-end">
          <h1 className="text-[28px] sm:text-[36px] font-bold leading-tight mb-6 text-black p-2 mt-[44px]">
            Reliable Performance,
            <br />
            Renewed For You
          </h1>
        </div>

        {/* Spacer div to create gap / New text container */}
        <div className="h-[52px] flex items-center justify-end text-black">
          <p className="text-base pr-4">
            Providing both used and brand new
            <br />
            appliances.
          </p>
        </div>

        {/* Additional spacer to increase gap */}
        <div className="h-[99px]"></div>

        {/* Mobile Description - Independent Container */}
        <div className="relative z-10 text-white">
          <p className="italic text-white text-base sm:text-lg leading-relaxed text-center mb-0 opacity-90 mt-[10px]">
            Discover quality pre-owned appliances that deliver everyday
            convenience without compromise. At YQL, we hand-select and restore
            trusted brands so you can enjoy dependable performance at a fraction
            of the price. Refresh your home with smart savings—and appliances
            that are built to last.
          </p>
        </div>

        {/* Small gap between paragraph and image */}
        <div className="h-[5px]"></div>

        {/* Single Larger Appliance Image - Independent Container */}
        <div className="relative z-10 flex justify-center items-center mt-0 pb-4">
          <img
            src={heroImage}
            alt="Modern appliances"
            className="w-[303px] h-[303px] sm:w-[335px] sm:h-[335px] object-contain opacity-90"
          />
        </div>
      </div>

      {/* Desktop Design - Keep existing layout unchanged */}
      <div
        className="hidden md:flex h-[70vh] lg:h-[75vh] items-center px-8 lg:px-12 relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[1200px] mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
            {/* HOMESLIDE DIV 4 - Text Content */}
            <div className="text-white flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-4 items-center md:items-start text-center md:text-left relative">
              {/* HOMESLIDE DIV 5 - Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl relative capitalize font-bold">
                Reliable Performance, Renewed for You
              </h1>

              {/* HOMESLIDE DIV 6 - Description Text */}
              <p className="italic text-gray-300 text-base sm:text-base md:text-lg lg:text-lg relative">
                Discover quality pre-owned appliances that deliver everyday
                convenience without compromise. At YQL, we hand-select and
                restore trusted brands so you can enjoy dependable performance
                at a fraction of the price.
                <br />
                Refresh your home with smart savings—and appliances that are
                built to last.
              </p>
            </div>

            {/* HOMESLIDE DIV 8 - Image Container */}
            <div className="hidden md:flex h-full items-center justify-end relative">
              <img
                className="h-full max-h-[60vh] lg:max-h-[70vh] w-auto object-cover"
                src={heroImage}
                alt="Modern appliances"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSlide;
