import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export default async function verifyUserToken(req, res, next) {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    if (!token) {
      return res.status(401).json({
        status: "Fail",
        error: "You are not logged in",
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Forbidden access" });
      }

      const id = decoded.id;

      const user = await User.findById(id).populate("activePet");

      if (!user) {
        return res.status(404).json({
          error: "User not found. Please login again",
        });
      }

      req.decodedUser = user;
      next();
    });
  } catch (error) {
    res.status(403).json({
      status: "Fail",
      message: "Invalid Token",
      error: error.message,
    });
  }
}
