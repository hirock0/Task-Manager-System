import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const PageNotFound = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      {/* Animated Icon */}
      <div className="text-blue-600" data-aos="zoom-in">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-32 h-32"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 9.172a4 4 0 015.656 5.656m0-5.656a4 4 0 00-5.656 0m5.656 5.656a4 4 0 01-5.656-5.656m5.656 5.656L18.364 18.364m0 0a2.828 2.828 0 11-4-4m4 4a2.828 2.828 0 014-4m-4 4L20.485 20.485"
          />
        </svg>
      </div>

      {/* Message */}
      <div className="text-center" data-aos="fade-up">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <p className="mt-4 text-xl text-gray-600">
          Oops! The page you are looking for doesn’t exist.
        </p>
      </div>

      {/* Back to Home Button */}
      <div className="mt-8" data-aos="fade-up" data-aos-delay="200">
        <a
          href="/"
          className="flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
