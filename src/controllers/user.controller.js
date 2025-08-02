import bcrypt from "bcryptjs";
import { generateToken } from "../config/user.token.js";
import User from "../models/user.model.js";
import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// sign up
export const signupUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(401).json({
        success: false,
        error: "Please provide name, email & password field in body",
      });
    }

    if (name.length < 3) {
      return res.status(400).json({
        success: false,
        error: "Name must be at least 3 characters.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters.",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
      });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(201).json({
      status: true,
      message: "User Signup successfully",

      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// // user login
export const loginUser = async(req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        error: "Please provide your credentials",
      });
    }

    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        error: "Email and Password is not correct",
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, userEmail.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Email and Password is not correct",
      });
    }

    const token = generateToken(userEmail);

    const { password: pwd, ...others } = userEmail.toObject();
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get my profile
export const getMyProfile = async (req, res, next) => {
  try {
    const user = req?.decodedUser;
    res.status(200).json({
      success: true,
      message: "My Profile",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = req.decodedUser;
    const name = req.body.name ? req.body.name : user.name;
    const file = req.file;

    let profilePicture = user.profilePicture;

    if (file && file.path) {
      if (user.profilePicture) {
        const oldFilename = user.profilePicture.split("/").pop();
        const oldPath = path.join(__dirname, "../../public/files", oldFilename);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      profilePicture = `${req.protocol}://${req.get("host")}/public/files/${
        file.filename
      }`;
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// change password
export const changePassword = async (req, res, next) => {
  try {
    const user = req?.decodedUser;

    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(201).send({
        success: false,
        message: "Old Password and New Password is requied in body",
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New Password must be at least 6 characters.",
      });
    }

    const isPasswordValid = bcrypt.compareSync(old_password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Old Password is not correct",
      });
    }

    const hashPassword = bcrypt.hashSync(new_password, 10);
    const userData = await User.findOneAndUpdate(
      { _id: user._id },
      { password: hashPassword }
    );

    const token = generateToken(userData);

    res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
      user: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// // delete user account
// exports.deleteUserAccount = async (req, res) => {
//   try {
//     const user = req?.decodedUser;

//     const userId = user?._id;
//     await User.deleteOne({ _id: userId });

//     res.status(200).send({
//       success: true,
//       message: "User Deleted Successfully",
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error in Delete User",
//       error: error.message,
//     });
//   }
// };

