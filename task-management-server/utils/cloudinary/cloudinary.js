import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLODNAME,
  api_key: process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLODUDINARY_API_SECRET,
});
export const uploadToCloudinary = async (img, flag) => {
  try {
    if (flag === "authUser") {
      const result = await cloudinary.uploader.upload(img, {
        folder: "assignment12/users",
      });
      return result;
    }
    if (flag === "property") {
      const result = await cloudinary.uploader.upload(img, {
        folder: "assignment12/propertises",
      });
      return result;
    }
  } catch (error) {
    throw new Error(error);
  }
};
