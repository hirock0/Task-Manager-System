import dotenv from "dotenv";
dotenv.config();
import { DBConnection } from "../lib/DBConnection.js";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../utils/cloudinary/cloudinary.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
export async function GoogleAuth(req, res) {
  try {
    const client = await DBConnection();
    const { name, email, image, uid } = await req.body;
    const findUser = await client
      .db("LoggedUser")
      .collection("users")
      .findOne({ email: email });

    if (findUser === null) {
      const userData = {
        name: name,
        email: email,
        image: image,
        role: "user",
        isAdmin: false,
        isAgent: false,
        isUser: true,
        uid: uid,
        recentDate: new Date().toLocaleDateString(),
        timeStamp: Date.now(),
      };
      const savedUser = await client
        .db("LoggedUser")
        .collection("users")
        .insertOne(userData);
      if (savedUser?.insertedId) {
        const tokenData = {
          id: savedUser?.insertedId,
          name: name,
          email: email,
          image: image,
          role: "user",
          auth: "google",
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
          expiresIn: "1d",
        });

        return res.status(200).json({
          message: "Login successfully",
          success: true,
          token,
        });
      } else {
        return res.status(200).json({
          message: "Data not saved to database",
          success: false,
        });
      }
    } else {
      const tokenData = {
        id: findUser?._id,
        name: findUser?.name,
        email: findUser?.email,
        image: findUser?.image,
        role: findUser?.role,
        auth: "google",
      };
      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        message: "Login successfully",
        success: true,
        token,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Data not found",
      success: false,
    });
  }
}

export async function Register(req, res) {
  try {
    const client = await DBConnection();
    const { name, email, password, image } = await req.body;
    const findUser = await client
      .db("LoggedUser")
      .collection("users")
      .findOne({ email: email });
    if (findUser) {
      return res.status(200).json({
        message: "User already exist",
        success: false,
      });
    }

    const flag = "authUser";
    const hashedPassword = await bcrypt.hash(password, 10);
    const responseImageUpload = await uploadToCloudinary(image, flag);
    if (responseImageUpload?.asset_id) {
      const userData = {
        name: name,
        email: email,
        password: hashedPassword,
        image: responseImageUpload?.secure_url,
        imagePublicId: responseImageUpload?.public_id,
        role: "user",
        isAdmin: false,
        isAgent: false,
        isUser: true,
        recentDate: new Date().toLocaleDateString(),
        timeStamp: Date.now(),
      };

      const savedUser = await client
        .db("LoggedUser")
        .collection("users")
        .insertOne(userData);

      if (savedUser?.insertedId) {
        const tokenData = {
          id: savedUser?.insertedId,
          email: email,
          name: name,
          image: responseImageUpload?.secure_url,
          imagePublicId: responseImageUpload?.public_id,
          role: "user",
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
          expiresIn: "1d",
        });
        return res.status(200).json({
          message: "Register successfully",
          success: true,
          token,
        });
      }
      return res.status(200).json({
        message: "Token not generated",
        success: false,
      });
    } else {
      return res.status(400).json({
        message: "Register not successfully",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Data not found",
      success: false,
    });
  }
}

export async function Login(req, res) {
  try {
    const client = await DBConnection();
    const { email, password } = await req.body;
    const findUser = await client
      .db("LoggedUser")
      .collection("users")
      .findOne({ email: email });
    if (!findUser) {
      return res.status(200).json({
        message: "Email is not correct",
        success: false,
      });
    }
    const verifyPassword = await bcrypt.compare(password, findUser?.password);
    if (!verifyPassword) {
      return res.status(200).json({
        message: "Password is not correct",
        success: false,
      });
    }
    const tokenData = {
      _id: findUser?._id,
      email: findUser?.email,
      name: findUser?.name,
      image: findUser?.image,
      imagePublicId: findUser?.imagePublicId,
      role: findUser?.role,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      message: "Login successfully",
      success: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Data not found",
      success: false,
    });
  }
}
export async function AuthUser(req, res) {
  try {
    return res.status(200).json({
      message: "User found",
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Data not found",
      success: false,
    });
  }
}
