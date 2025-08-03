import bcrypt from "bcryptjs";
import { generateToken } from "../config/user.token.js";
import PetType from "../models/pet.type.modal.js";
import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// create pet type
export const createPetType = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Please provide the 'name' field in the body",
      });
    }

    // Handle image upload
    let image = null;
    const file = req.file;
    if (file && file.filename) {
      image = `${req.protocol}://${req.get("host")}/public/files/${
        file.filename
      }`;
    } else {
      return res.status(400).json({
        success: false,
        error: "Please provide an image",
      });
    }

    // Check if pet type already exists
    const existingPetType = await PetType.findOne({ name });
    if (existingPetType) {
      return res.status(409).json({
        success: false,
        error: "Pet type with this name already exists",
      });
    }

    // Create new pet type
    const response = await PetType.create({ name, image });

    res.status(201).json({
      success: true,
      message: "Pet type created successfully",
      data: response,
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
