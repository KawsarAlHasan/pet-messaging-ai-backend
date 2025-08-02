import mongoose from "mongoose";

const ForgotPasswordSchema = mongoose.Schema({
  reset_code: {
    type: String,
    required: true,
    length: 6,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
  },
  reset_code_expire: {
    type: Date,
    required: true,
    index: { expires: "5m" },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ForgotPassword", ForgotPasswordSchema);
