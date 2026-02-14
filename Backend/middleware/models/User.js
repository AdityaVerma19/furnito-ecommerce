import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: function () {
        return !this.googleId;
      },
    },
    lastName: {
      type: String,
      trim: true,
      required: function () {
        return !this.googleId;
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String, // hashed
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
