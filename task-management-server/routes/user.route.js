import express from "express";
import { middleware } from "../middleware/middleware.js";
import {
  GoogleAuth,
  Login,
  Register,
  AuthUser
} from "../controllers/user.controller.js";
export const userRoutes = express.Router();
userRoutes.post("/register", Register);
userRoutes.post("/login", Login);
userRoutes.post("/googleAuth", GoogleAuth);
userRoutes.get("/authUser", middleware, AuthUser);
