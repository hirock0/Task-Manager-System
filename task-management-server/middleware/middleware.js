import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
export const middleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Assuming Bearer token format
  if (!token) {
    return res
      .status(401)
      .json({
        message: "Access Denied: No Token Provided",
        success: false,
        user: null,
      });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};
