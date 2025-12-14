import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "admin",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastLogin: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
