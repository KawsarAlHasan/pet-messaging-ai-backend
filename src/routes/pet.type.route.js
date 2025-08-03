import express from "express";
import uploadImage from "../middleware/file.uploader.js";
import {
  createPetType,
  deletePetTypeById,
  getAllPetTypes,
  getPetTypeById,
  updatePetTypeById,
} from "../controllers/pet.type.controller.js";

const router = express.Router();

router.post("/create", uploadImage.single("image"), createPetType);
router.get("/all", getAllPetTypes);
router.get("/:id", getPetTypeById);
router.patch("/update/:id", uploadImage.single("image"), updatePetTypeById);
router.delete("/delete/:id", deletePetTypeById);

export default router;
