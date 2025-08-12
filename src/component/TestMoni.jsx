import React, { useState, useEffect } from "react";
import pop from "./images/nordic char.png";
const TestimonialSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      header: "Best quality with comfort ever!",
      text: "I'm thrilled with my recent furniture purchase from FURNI! Their site made finding a modern, inviting sofa for my living room easy and enjoyable. The sofa’s stylish design, high-quality fabric, and perfect balance of support and comfort exceeded my expectations. At a reasonable price, it’s earned tons of compliments from guests. FURNI has a lifelong customer!",
      photo: pop,
      name: "Aarav Lynn",
      location: "San Francisco, USA",
    },
    {
      header: "Trustworthy Quality bent with Nature",
      text: "FURNI made online furniture shopping a breeze! My new bedroom set looks stunning, with ergonomic designs that enhance sleep and relaxation. The premium finishes, sturdy wood, and elegant yet practical style exceeded my expectations—all at an affordable price. I’m proud to showcase FURNI in my home and highly recommend them!",
      photo: pop,
      name: "Miyah Miles",
      location: "London, UK",
    },
    {
      header: "Ergonomic Design That Powers Our Workdays",
      text: "FURNI transformed our startup’s small office with sleek, functional furniture. Their professional service made ordering modern desks and ergonomic chairs a breeze. The clean, premium design fits our creative workspace perfectly, and the ergonomics have boosted productivity by eliminating backaches. Despite our tight budget, FURNI delivered a polished look that reflects our brand. Couldn’t ask for more!",
      photo: pop,
      name: "Francisco Gomes",
      location: "Lisbon, Portugal",
    },
  ];
  const maxSlide = slides.length - 1;

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === maxSlide ? 0 : prev + 1));
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? maxSlide : prev - 1));
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") previousSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="max-w-[100rem] my-5 h-[40rem] mx-auto relative overflow-hidden">
      <hr />
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute top-0 w-full h-[50rem] flex items-center justify-center transition-transform duration-1000"
          style={{ transform: `translateX(${100 * (index - currentSlide)}%)` }}
        >
          <div className="w-[65%] relative  before:absolute before:-top-[5.7rem] before:-left-[6.8rem] before:text-[20rem] before:leading-none before:text-primary before:z-[-1]">
            <h5 className="text-[1.8rem] sm:text-[2.25rem] font-bold mb-6">
              {slide.header}
            </h5>
            <blockquote className="  sm:text-lg mb-[3.5rem] text-[1rem] text-[#666]">
              {slide.text}
            </blockquote>
            <address className="ml-12 grid grid-cols-[6.5rem_1fr] gap-x-8 not-italic">
              <img
                src={slide.photo}
                alt={slide.name}
                className="row-span-2 w-0 sm:w-[6.5rem] rounded-full object-cover"
              />
              <h6 className="text-sm font-medium self-end m-0">{slide.name}</h6>
              <p className="text-sm">{slide.location}</p>
            </address>
          </div>
        </div>
      ))}

      <button
        className="absolute top-1/2 left-[6%] transform -translate-x-1/2 -translate-y-1/2  bg-[rgba(255,255,255,0.7)] text-[#333] rounded-full w-[5.5rem] h-[5.5rem] text-[2rem] cursor-pointer border-none font-inherit"
        onClick={previousSlide}
      >
        ←
      </button>
      <button
        className="absolute top-1/2 right-[6%] transform translate-x-1/2 -translate-y-1/2  bg-[rgba(255,255,255,0.7)] text-[#333] text-[2rem] rounded-full w-[5.5rem] h-[5.5rem]  cursor-pointer border-none font-inherit"
        onClick={nextSlide}
      >
        →
      </button>

      <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 flex">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full mr-[1.75rem] cursor-pointer transition-all duration-500 ${
              currentSlide === index
                ? "bg-white opacity-100"
                : "bg-[#b9b9b9] opacity-70"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
