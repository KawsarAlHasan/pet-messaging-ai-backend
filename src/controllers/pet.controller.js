import Pets from "../models/pet.modal.js";
import fs from "fs";
import path from "path";

// Create Pet
export const createPet = async (req, res, next) => {
  try {
    const { name, dateOfBirth, petType, owner, status } = req.body;

    // Validate required fields
    if (!name || !petType || !owner) {
      return res.status(400).json({
        success: false,
        error: "Please provide 'name', 'petType', and 'owner' fields",
      });
    }

    // Handle image upload
    let profilePicture = null;
    const file = req.file;
    if (file && file.filename) {
      profilePicture = `${req.protocol}://${req.get("host")}/public/files/${
        file.filename
      }`;
    } else {
      return res.status(400).json({
        success: false,
        error: "Please provide a profile picture",
      });
    }

    // Check if a pet with the same name & owner already exists (to avoid duplicates)
    const existingPet = await Pets.findOne({ name, owner });
    if (existingPet) {
      return res.status(409).json({
        success: false,
        error: "A pet with this name already exists for this owner",
      });
    }

    // Create new pet
    const newPet = await Pets.create({
      name,
      dateOfBirth: dateOfBirth || null,
      petType,
      owner,
      status: status || "active", // Default to "active" if not provided
      profilePicture,
    });

    res.status(201).json({
      success: true,
      message: "Pet created successfully",
      data: newPet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all pet types
export const getAllPetTypes = async (req, res, next) => {
  try {
    const petTypes = await PetType.find();

    if (!petTypes) {
      return res.status(404).json({
        success: false,
        message: "Pet types not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pet types fetched successfully",
      data: petTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get pet type by id
export const getPetTypeById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const petType = await PetType.findById(id);

    if (!petType) {
      return res.status(404).json({
        success: false,
        message: "Pet type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pet type fetched successfully",
      data: petType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update pet type by id
export const updatePetTypeById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    // Find existing pet type
    const petType = await PetType.findById(id);
    if (!petType) {
      return res.status(404).json({
        success: false,
        message: "Pet type not found",
      });
    }

    // Update name if provided
    if (name) {
      const existingPetType = await PetType.findOne({ name, _id: { $ne: id } });
      if (existingPetType) {
        return res.status(409).json({
          success: false,
          message: "Another pet type with this name already exists",
        });
      }
      petType.name = name;
    }

    // Handle new image upload
    const file = req.file;
    if (file && file.filename) {
      if (petType.image) {
        const oldFilename = petType.image.split("/").pop();
        const oldPath = path.join(
          process.cwd(),
          "public",
          "files",
          oldFilename
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Set new image URL
      petType.image = `${req.protocol}://${req.get("host")}/public/files/${
        file.filename
      }`;
    }

    // Save updated pet type
    await petType.save();

    res.status(200).json({
      success: true,
      message: "Pet type updated successfully",
      data: petType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete pet type by id
export const deletePetTypeById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const petType = await PetType.findById(id);
    if (!petType) {
      return res.status(404).json({
        success: false,
        message: "Pet type not found",
      });
    }

    if (petType.image) {
      const oldFilename = petType.image.split("/").pop();
      const oldPath = path.join(process.cwd(), "public", "files", oldFilename);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await PetType.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Pet type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
