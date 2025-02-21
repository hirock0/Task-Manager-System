import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FiUserPlus, FiLock, FiMail, FiArrowLeft } from "react-icons/fi";
import { useSecureAxios } from "../../utils/AxiosInstance/SecureAxiosInstance";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/Firebase/Firebase";
import { useLocation } from "react-router-dom";
export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useSecureAxios();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/user/login", data);
      if (response?.data?.success) {
        localStorage.setItem("token", response?.data?.token);
        swal({
          title: response?.data?.message,
          icon: "success",
        });
        navigate(location.state === null ? "/" : location.state);
        setLoading(false);
      } else {
        swal({
          title: response?.data?.message,
          icon: "warning",
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw new Error(String(error));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const googleLogin = async () => {
    try {
      const Provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, Provider);
      const userData = {
        name: response?.user?.displayName,
        email: response?.user?.email,
        image: response?.user?.photoURL,
        uid: response?.user?.uid,
      };

      const dbResponse = await axios.post("/api/user/googleAuth", userData);
      if (dbResponse?.data?.success) {
        localStorage.setItem("token", dbResponse?.data?.token);
        swal({
          title: dbResponse?.data?.message,
          icon: "success",
        });
        navigate(location.state === null ? "/" : location.state);
      } else {
        swal({
          title: dbResponse?.data?.message,
          icon: "warning",
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className="flex md:flex-row relative h-screen bg-zinc-100">
      {/* Left Side with Image */}
      <div className="md:w-1/2 max-md:hidden w-full h-64 md:h-full bg-gray-200">
        <img
          src="https://i.ibb.co.com/JqYxCQZ/ergonomic-office-chair.webp"
          alt="Login"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Side with Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center text-blue-500 hover:underline mb-4"
          >
            <FiArrowLeft className="mr-2" size={20} />
            Back
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative mt-1">
                <FiMail
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <input
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="pl-10 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <FiLock
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="pl-10 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="mb-4 text-right">
              <Link to="/" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              {!loading ? (
                <span className=" flex items-center gap-3">
                  <FiLock size={18} />
                  Login
                </span>
              ) : (
                <div className=" loading loading-spinner loading-md"></div>
              )}
            </button>

            <button
              type="button"
              onClick={googleLogin}
              className="w-full bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-4"
            >
              <FcGoogle size={18} />
              Login with Google
            </button>
          </form>

          {/* Links Section */}
          <div className="text-center mt-4">
            <p className="text-sm">
              Do not have an account?
              <Link
                to={`/register`}
                state={location.state}
                className="text-blue-500 hover:underline flex items-center justify-center gap-1"
              >
                <FiUserPlus size={16} />
                Create a new account
              </Link>
            </p>
            <p className="text-sm mt-2">
              By logging in, you agree to our
              <Link to={"/"} className="text-blue-500 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
