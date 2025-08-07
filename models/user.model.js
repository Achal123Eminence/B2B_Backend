import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      // optional ID field; could be mapped to something external
    },
    first_name: {
      type: String,
      default: "",
      trim: true,
    },
    last_name: {
      type: String,
      default: "",
      trim: true,
    },
    cloud_account_id: {
      type: String,
      required: true,
      trim: true,
    },
    cloud_auth: {
      type: String,
      required: true,
    },
    cloud_image_url: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    encrypted_password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
