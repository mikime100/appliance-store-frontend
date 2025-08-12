import wehelp1 from "./images/3-image.png";
import wehelp2 from "./images/3-image2.png";
import wehelp3 from "./images/3-image3.png";

function WeHelp() {
  return (
    <div className="w-full px-4 sm:px-6 md:max-w-[1100px] mx-auto my-10 md:my-20">
      <hr className="mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
        {/* Title first on mobile */}
        <div className="md:hidden text-center">
          <h1 className="font-bold text-2xl capitalize">
            We help you power smarter living
          </h1>
        </div>

        {/* Image Grid - Collage on mobile, layered on desktop */}
        <div className="block md:block relative md:h-[400px]">
          {/* Mobile overlapping collage */}
          <div className="md:hidden relative h-[380px] bg-white rounded-2xl p-2">
            {/* 3-image2.png - now large on the left */}
            <img
              src={wehelp2}
              alt="Large left"
              className="absolute left-2 top-2 w-[58%] h-[92%] object-cover rounded-xl shadow-md"
            />
            {/* 3-image.png - now small top-right */}
            <img
              src={wehelp1}
              alt="Top right"
              className="absolute right-2 top-2 w-[38%] h-[30%] object-cover rounded-xl shadow-md"
            />
            {/* 3-image3.png - medium bottom-right, overlapping left slightly */}
            <img
              src={wehelp3}
              alt="Bottom right overlap"
              className="absolute w-[46%] h-[56%] object-cover rounded-xl shadow-md"
              style={{ top: "36%", left: "46%" }}
            />
          </div>
          {/* Desktop layered composition */}
          <div className="hidden md:block">
            <img
              src={wehelp2}
              alt="Modern interior"
              className="w-64 absolute "
            />
            <img
              src={wehelp3}
              alt="Interior detail"
              className="w-32 absolute top-0 right-32 "
            />
            <img
              src={wehelp1}
              alt="Furniture piece"
              className="w-44 absolute top-40 left-44 "
            />
          </div>
        </div>

        {/* Text Content - Always visible */}
        <div className="space-y-4 text-center md:text-left mt-6 md:mt-0">
          {/* Desktop title */}
          <h1 className="hidden md:block font-bold text-2xl md:text-3xl capitalize">
            We help you power smarter living
          </h1>
          {/* Shorter copy on mobile to avoid crowding */}
          <p className="mx-auto md:mx-0 max-w-[500px] md:max-w-none md:hidden">
            At YQL, appliances are the heart of your home. Choose from quality
            pre-owned and brand-new selections designed for reliability,
            performance, and value.
          </p>
          <p className="hidden md:block mx-auto md:mx-0 max-w-[500px] md:max-w-none">
            At YQL, we believe appliances aren't just tools — they're the heart
            of your home. That's why we offer both quality pre-owned and
            brand-new appliances that combine reliability, performance, and
            value. Whether you're upgrading your kitchen, replacing a washer, or
            outfitting a new space, our carefully selected inventory helps you
            get the job done — affordably and efficiently. With YQL, you power
            your home with confidence.
          </p>
          {/* Mobile mosaic text layout */}
          <ul className="md:hidden grid grid-cols-2 gap-3 auto-rows-[minmax(72px,_auto)] mt-4 text-sm">
            <li className="col-span-2 bg-[#f1f5f9] rounded-2xl shadow-md p-3 text-left font-medium">
              Sleek, modern appliances that fit any interior
            </li>
            <li className="row-span-2 bg-[#f1f5f9] rounded-2xl shadow-md p-3 text-left font-medium">
              Refurbished and new units tested for long-lasting performance
            </li>
            <li className="bg-[#f1f5f9] rounded-2xl shadow-md p-3 text-left font-medium">
              Energy-efficient technology to save money and the planet
            </li>
            <li className="bg-[#f1f5f9] rounded-2xl shadow-md p-3 text-left font-medium">
              Everyday value—top-tier quality without the premium price
            </li>
          </ul>
          {/* Desktop bullets unchanged */}
          <ul className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 font-thin text-sm">
            <li className="list-disc list-inside font-medium">
              Sleek, modern appliances that fit any interior
            </li>
            <li className="list-disc list-inside font-medium">
              Refurbished and new units tested for long-lasting performance
            </li>
            <li className="list-disc list-inside font-medium">
              Energy-efficient technology to save money and the planet
            </li>
            <li className="list-disc list-inside font-medium">
              Everyday value—top-tier quality without the premium price
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WeHelp;
