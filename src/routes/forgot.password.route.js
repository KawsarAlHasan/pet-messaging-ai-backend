import express from "express";
import {
  newPasswordSet,
  sendResetCode,
  verifyResetCode,
} from "../controllers/fotgot.password.controller.js";

const router = express.Router();

router.post("/send-reset-code", sendResetCode);
router.post("/verify-reset-code", verifyResetCode);
router.post("/set-new-password", newPasswordSet);

export default router;
