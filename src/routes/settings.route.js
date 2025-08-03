import express from "express";
import {
  getStaticContent,
  updateSetting,
} from "../controllers/settings.controller.js";

const router = express.Router();

// Get static content by type
router.get("/:type", getStaticContent);
router.put("/update", updateSetting);

export default router;
