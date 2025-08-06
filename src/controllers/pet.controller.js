import Pets from "../models/pet.modal.js";
import fs from "fs";
import path from "path";

// Create Pet
export const createPet = async (req, res, next) => {
  try {
    const {
      name,
      dateOfBirth,
      petType,
      gender,
      status,
      petAge,
      petBreed,
      isDomesticOrStray,
      petPersonality,
    } = req.body;

    const parsedPetPersonality = petPersonality
      ? JSON.parse(petPersonality)
      : [];

    const owner = req.decodedUser._id;

    // Validate required fields
    if (!name || !petType || !gender) {
      return res.status(400).json({
        success: false,
        error: "Please provide 'name', 'petType' and 'gender' fields",
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
      gender,
      status: status || "active", // Default to "active" if not provided
      profilePicture,
      petAge,
      petBreed,
      isDomesticOrStray,
      petPersonality: parsedPetPersonality,
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

// get all my pet
export const getAllMyPets = async (req, res, next) => {
  try {
    const owner = req.decodedUser._id;

    const pets = await Pets.find({ owner });

    if (!pets) {
      return res.status(404).json({
        success: false,
        message: "Pets not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pets fetched successfully",
      totalPets: pets.length,
      data: pets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get pet  by id
export const getPetById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const pet = await Pets.findById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pet fetched successfully",
      data: pet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// // update pet by id
export const updatePetById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {
      name,
      dateOfBirth,
      petType,
      gender,
      status,
      petAge,
      petBreed,
      isDomesticOrStray,
      petPersonality,
    } = req.body;

    const owner = req.decodedUser._id;

    // Find the pet and verify ownership
    const pet = await Pets.findOne({ _id: id, owner });
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found or you don't have permission",
      });
    }

    // Handle petPersonality (parse if it's a string)
    let parsedPersonality = [];
    try {
      parsedPersonality = petPersonality
        ? typeof petPersonality === "string"
          ? JSON.parse(petPersonality)
          : petPersonality
        : pet.petPersonality;
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Invalid petPersonality format",
        error: parseError.message,
      });
    }

    // Handle profile picture update
    let profilePicture = pet.profilePicture;
    if (req.file) {
      // Delete old picture if exists
      if (pet.profilePicture) {
        try {
          const oldFilename = pet.profilePicture.split("/").pop();
          const oldPath = path.join(
            process.cwd(),
            "public",
            "files",
            oldFilename
          );
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch (fileError) {
          console.error("Error deleting old profile picture:", fileError);
        }
      }

      profilePicture = `${req.protocol}://${req.get("host")}/public/files/${
        req.file.filename
      }`;
    }

    // Prepare update data
    const updateData = {
      name: name || pet.name,
      dateOfBirth: dateOfBirth || pet.dateOfBirth,
      petType: petType || pet.petType,
      gender: gender || pet.gender,
      profilePicture,
      status: status || pet.status,
      petAge: petAge || pet.petAge,
      petBreed: petBreed || pet.petBreed,
      isDomesticOrStray: isDomesticOrStray || pet.isDomesticOrStray,
      petPersonality: parsedPersonality,
    };

    // Perform the update
    const updatedPet = await Pets.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found after update attempt",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pet updated successfully",
      data: updatedPet,
    });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update pet status by id
export const updatePetStatusById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const owner = req.decodedUser._id;

    const pet = await Pets.findOne({ _id: id, owner });
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found or you don't have permission",
      });
    }

    const updatedPet = await Pets.findByIdAndUpdate(
      id,
      {
        status: status || pet.status,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Pet status updated successfully",
      data: updatedPet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete pet by id
export const deletePetById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const owner = req.decodedUser._id;

    const pet = await Pets.findOne({ _id: id, owner });
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found or you don't have permission",
      });
    }

    if (pet.profilePicture) {
      const oldFilename = pet.profilePicture.split("/").pop();
      const oldPath = path.join(process.cwd(), "public", "files", oldFilename);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await Pets.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Pet deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
