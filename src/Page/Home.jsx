import HomeProduct from "../component/HomeProduct";
import HomeSlide from "../component/HomeSlide";
import WhyChooseUs from "../component/WhyChooseUs";
import WeHelp from "../component/WeHelp";
import ContactUs from "../component/ContactUs";
function Home() {
  return (
    <div>
      <HomeSlide />
      <HomeProduct />
      <WhyChooseUs />
      <WeHelp />
      <ContactUs />
    </div>
  );
}

export default Home;
