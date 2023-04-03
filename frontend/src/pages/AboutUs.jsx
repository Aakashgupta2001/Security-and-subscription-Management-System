import img from "../assets/img/about.jpg";

const AboutUs = () => {
  return (
    <div class="py-16  bg-gray-900 flex justify-center items-center h-screen  text-gray-300">
      <div class="container m-auto px-6  md:px-12 xl:px-6">
        <div class="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center  lg:gap-12">
          <div class="md:5/12 lg:w-5/12 self-end  flex justify-end">
            <img
              src={img}
              alt="image"
              loading="lazy"
              className="h-auto max-w-sm rounded-lg shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30"
            />
          </div>
          <div class="md:7/12 lg:w-6/12">
            <h2 class="text-2xl  font-bold md:text-4xl">About Us</h2>
            <p class="mt-6 ">
              We are a team of 5 individuals who are talented in diffrent fields that come together to create the perfect end product for you.
            </p>
            <p class="mt-4 ">
              {" "}
              Every Business needs both a good website & really good marketing, We believe that we can solve your technological and marketing needs.
              Contact Us Today For A Detailed Experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutUs;
