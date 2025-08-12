// import { FaCar, FaDesktop, FaHandshake } from "react-icons/fa6";
// import { FaCheckCircle } from "react-icons/fa";
// import whychoos from "./images/why-choose-us-img 1.jpg";

// const whychoose = [
//   {
//     id: 1,
//     title: "Quality Materials",
//     desc: "We use only the finest materials to ensure durability and style that lasts.",
//     image: <FaHandshake className="w-11 h-11" />,
//   },
//   {
//     id: 2,
//     title: "Expert Craftsmanship",
//     desc: "Our skilled artisans pay attention to every detail, creating pieces that are both functional and beautiful.",
//     image: <FaDesktop className="w-11 h-11" />,
//   },
//   {
//     id: 3,
//     title: "Timeless Design",
//     desc: "Our designs are timeless and versatile, making them a perfect fit for any space.",
//     image: <FaCar className="w-11 h-11" />,
//   },
//   {
//     id: 4,
//     title: "Sustainable Practices",
//     desc: "We prioritize sustainability in our production process, using eco-friendly materials and methods.",
//     image: <FaCheckCircle className="w-11 h-11" />,
//   },
// ];

// function WhyChooseUs() {
//   return (
//     <div className="w-[1100px] m-auto mt-9 ">
//       <hr />
//       <div className="grid grid-cols-3 gap-6 pt-6 items-center ">
//         <div className="col-span-2">
//           <h1 className="capitalize font-bold text-3xl ">Why choose us</h1>
//           <p className="font-thin text-sm capitalize">
//             at our design studio, we pride ourselves on using only the finest
//             materials and
//             <br />
//             techniques. each piece of furniture is crafted with care, ensuring
//             durability and style
//             <br />
//             that latest
//           </p>
//           <div>
//             <ul className="grid grid-cols-2 gap-4 mt-4">
//               {whychoose.map((item) => (
//                 <Item key={item.id} item={item} />
//               ))}
//             </ul>
//           </div>
//         </div>
//         <div>
//           <img src={whychoos} alt="whychooseus" className="w-96  h-96" />
//         </div>
//       </div>
//     </div>
//   );
// }
// function Item({ item }) {
//   return (
//     <li className="space-y-2">
//       <span>{item.image}</span>
//       <h1 className="font-bold ">{item.title}</h1>
//       <p>{item.desc}</p>
//     </li>
//   );
// }
// export default WhyChooseUs;

import {
  FaCar,
  FaDesktop,
  FaHandshake,
  FaRecycle,
  FaCertificate,
} from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import whychoos from "./images/about-us.png";

const whychoose = [
  {
    id: 1,
    title: "Quality You Can Trust",
    desc: "Each appliance undergoes rigorous testing to ensure it meets our high standards of functionality, cleanliness, and safety.",
    image: <FaHandshake className="w-6 h-6 md:w-8 md:h-8" />,
  },
  {
    id: 2,
    title: "Certified Refurbishment",
    desc: "Our expert technicians restore appliances to excellent working condition, replacing worn-out parts and ensuring peak performance.",
    image: <FaCertificate className="w-6 h-6 md:w-8 md:h-8" />,
  },
  {
    id: 3,
    title: "Affordable + Sustainable",
    desc: "Get top-brand appliances at a fraction of the cost—while keeping usable machines out of landfills.",
    image: <FaRecycle className="w-6 h-6 md:w-8 md:h-8" />,
  },
  {
    id: 4,
    title: "Modern & Reliable Selection",
    desc: "From sleek kitchen essentials to heavy-duty washers and dryers, our inventory is curated for performance, style, and value.",
    image: <FaCheckCircle className="w-6 h-6 md:w-8 md:h-8" />,
  },
];

function WhyChooseUs() {
  return (
    <div className="w-full px-4 sm:px-6 md:max-w-[1100px] mx-auto mt-9">
      <hr className="mx-auto w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Text content - centered on mobile, left-aligned on md+ */}
        <div className="md:col-span-2 text-center sm:text-left">
          {/* Mobile image (keeps desktop unchanged) */}
          <div className="md:hidden mb-4">
            <img
              src={whychoos}
              alt="About us"
              className="w-full h-48 sm:h-56 object-cover rounded-xl"
            />
          </div>
          <h1 className="capitalize font-bold text-2xl md:text-3xl">
            Why Choose Us
          </h1>
          {/* Shorter copy on mobile, full copy on desktop */}
          <p className="font-thin text-sm capitalize mt-2 mx-auto sm:mx-0 max-w-[500px] sm:max-w-none md:hidden">
            At our used appliance marketplace, we're committed to giving
            high-quality appliances a second life.
          </p>
          <p className="hidden md:block font-thin text-sm capitalize mt-2 mx-auto sm:mx-0 max-w-[500px] sm:max-w-none">
            At our used appliance marketplace, we're committed to giving
            high-quality appliances a second life. Every product is inspected,
            tested, and guaranteed to deliver reliable performance—without the
            premium price tag.
          </p>
          <div className="mt-6">
            <ul className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6 justify-items-center sm:justify-items-start">
              {whychoose.map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </ul>
          </div>
        </div>

        {/* Image - hidden on mobile, visible on md+ */}
        <div className="hidden md:flex justify-center items-start">
          <img
            src={whychoos}
            alt="why choose us"
            className="w-full max-w-[384px] h-auto aspect-square object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

function Item({ item }) {
  return (
    <li className="space-y-1 p-2 md:p-0 text-center sm:text-left">
      <span className="text-[#457b66] block mx-auto sm:mx-0">{item.image}</span>
      <h1 className="font-semibold text-[14px] md:text-lg">{item.title}</h1>
      <p className="text-gray-600 text-[12px] leading-snug md:text-sm">
        {item.desc}
      </p>
    </li>
  );
}

export default WhyChooseUs;
