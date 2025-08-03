import express from "express";
import {
  changePassword,
  deleteUserAccount,
  getMyProfile,
  loginUser,
  signupUser,
  updateProfile,
} from "../controllers/user.controller.js";
import verifyUserToken from "../middleware/verify.user.token.js";
import uploadImage from "../middleware/file.uploader.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/my-profile", verifyUserToken, getMyProfile);
router.patch("/change-password", verifyUserToken, changePassword);
router.patch(
  "/update-profile",
  uploadImage.single("profilePicture"),
  verifyUserToken,
  updateProfile
);

router.delete("/delete-account", verifyUserToken, deleteUserAccount);

export default router;
