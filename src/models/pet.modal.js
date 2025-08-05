import mongoose from "mongoose";

const PetsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    petType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PetType",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePicture: String,
    status: {
      type: String,
      // enum: ["active", "inactive", "blocked"],
      default: "Active",
    },
    petPersonality: [
      {
        key: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Pets", PetsSchema);
