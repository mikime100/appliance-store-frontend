import wehelp1 from "./images/3-image.png";
import wehelp2 from "./images/3-image2.png";
import wehelp3 from "./images/3-image3.png";

function WeHelp() {
  return (
    <div className="w-full px-4 sm:px-6 md:max-w-[1100px] mx-auto my-10 md:my-20">
      <hr className="mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
        {/* Image Grid - Hidden on mobile, visible on md+ */}
        <div className="hidden md:block relative h-[400px]">
          <img src={wehelp2} alt="Modern interior" className="w-64 absolute " />
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

        {/* Text Content - Always visible */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="font-bold text-2xl md:text-3xl capitalize">
            We help you power smarter living
          </h1>
          <p className="mx-auto md:mx-0 max-w-[500px] md:max-w-none">
            At YQL, we believe appliances aren't just tools — they're the heart
            of your home. That's why we offer both quality pre-owned and
            brand-new appliances that combine reliability, performance, and
            value. Whether you're upgrading your kitchen, replacing a washer, or
            outfitting a new space, our carefully selected inventory helps you
            get the job done — affordably and efficiently. With YQL, you power
            your home with confidence.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 font-thin text-sm">
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
