import express from "express";
import uploadImage from "../middleware/file.uploader.js";
import verifyUserToken from "../middleware/verify.user.token.js";
import { createPet, deletePetById, getAllMyPets, getPetById, updatePetById } from "../controllers/pet.controller.js";

const router = express.Router();

router.post("/create", verifyUserToken, uploadImage.single("profilePicture"), createPet);
router.get("/all", verifyUserToken, getAllMyPets);
router.get("/:id", getPetById);
router.patch("/update/:id", verifyUserToken, uploadImage.single("profilePicture"), updatePetById);

router.delete("/delete/:id", verifyUserToken, deletePetById);

export default router;
