import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { STAGE, MONGODB_URL_LOCAL } from "../common/constants.js";
import { encrypt } from "../helper/encryption.js";

let CONNECTIONURL = MONGODB_URL_LOCAL,
  dbOptions = { useNewUrlParser: true };

console.log("You are in Local Database environment!");

export const dbConnection = () => {
  return mongoose
    .connect(CONNECTIONURL, dbOptions)
    .then(async (res) => {
      console.log("DB Connected successfully");

      // Create default admin user if not exists
      const defaultUser = {
        username: "achal97",
        email: "achal408mg@gmail.com",
        password: "Abcd@1234",
        cloud_account_id: "default-cloud-account-id",
        cloud_auth: "default-cloud-auth-token",
        cloud_image_url: "https://your-default-image-url.com/image.png", // optional since default is ""
        type: "admin",
      };

      try {
        const existingUser = await User.findOne({ email: defaultUser.email });

        if (!existingUser) {
          const encryptedPassword = encrypt(defaultUser.password);

          const newUser = new User({
            username: defaultUser.username,
            email: defaultUser.email,
            encrypted_password: encryptedPassword ,
            cloud_account_id: defaultUser.cloud_account_id,
            cloud_auth: defaultUser.cloud_auth,
            cloud_image_url: defaultUser.cloud_image_url,
            type: defaultUser.type,
          });

          await newUser.save();
          console.log("Default admin user created");
        } else {
          console.log("Default admin user already exists");
        }
      } catch (err) {
        console.error("Error creating default admin user:", err);
      }
    })
    .catch((error) => console.log("Error in DB connection", error));
};
