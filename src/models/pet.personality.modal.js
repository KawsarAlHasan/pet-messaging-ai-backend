import mongoose from "mongoose";

const PetPersonalitySchema = mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pets",
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PetPersonalities", PetPersonalitySchema);
