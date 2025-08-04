import express from "express";
import uploadImage from "../middleware/file.uploader.js";
import { createPet } from "../controllers/pet.controller.js";

const router = express.Router();

router.post("/create", uploadImage.single("image"), createPet);
// router.get("/all", getAllPetTypes);
// router.get("/:id", getPetTypeById);
// router.patch("/update/:id", uploadImage.single("image"), updatePetTypeById);
// router.delete("/delete/:id", deletePetTypeById);

export default router;
