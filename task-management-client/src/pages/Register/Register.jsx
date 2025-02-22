import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { useSecureAxios } from "../../utils/AxiosInstance/SecureAxiosInstance";
import { useLocation } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiArrowLeft,
  FiImage,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Register() {
  const location = useLocation();
  const axios = useSecureAxios();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const regex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
      if (!regex.test(data.password.toString())) {
        swal({
          title: "Registration faild",
          text: "password must be greater than 6 characters, at least one upper case,one lower case and a special character.",
          icon: "warning",
        });
        setLoading(false);
      } else {
        data.image = imagePreview;
        const response = await axios.post("/api/user/register", data);
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
      }
    } catch (error) {
      setLoading(false);
      throw new Error(String(error));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const password = watch("password");

  const handleImagePreview = (event) => {
    const file = event.target.files?.[0];

    if (file.size > 100000) {
      swal({
        title: "Image is bigger than 100 kb",
        text: "Please select less than 100 kb image",
        icon: "warning",
      });
      setImagePreview(null);
    } else {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex  md:flex-row md:h-screen bg-zinc-100">
      {/* Left Side with Image */}
      <div className="md:w-1/2 max-md:hidden w-full h-64 md:h-full bg-gray-200">
        <img
          src="https://cdn.pixabay.com/photo/2020/03/03/12/51/female-4898690_960_720.jpg"
          alt="Registration"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Side with Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-500 hover:underline mb-4"
          >
            <FiArrowLeft className="mr-2" size={20} />
            Back
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="relative mt-1">
                <FiUser
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="pl-10 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

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

            {/* Confirm Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative mt-1">
                <FiLock
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="pl-10 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Image Upload Field */}
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Picture
              </label>
              <div className="relative mt-1">
                <FiImage
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image", {
                    required: "Profile picture is required",
                  })}
                  onChange={handleImagePreview}
                  className="pl-10 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 w-20 h-20 rounded-full object-cover"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              {!loading ? (
                <span className=" flex items-center gap-3">
                  <FiUserPlus size={18} />
                  Register
                </span>
              ) : (
                <div className=" loading loading-spinner loading-md"></div>
              )}
            </button>
          </form>

          {/* Links Section */}
          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to={"/login"} className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
            <p className="text-sm mt-2">
              By creating an account, you agree to our{" "}
              <Link to={""} className="text-blue-500 hover:underline">
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
