import heroImage from "./images/final fridge1.png";
import backgroundImage from "./images/DIV-1-background.png";
import { Link } from "react-router-dom";
function HomeSlide() {
  return (
    <div className="w-full pt-4 sm:pt-8 md:pt-12 lg:pt-16 relative">
      <div
        className="h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] flex items-center px-4 sm:px-6 md:px-8 lg:px-12 relative"
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
                convenience without compromise. At APPLIX, we hand-select and
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
