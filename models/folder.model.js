import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    panelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "MotherPanel",
    },
    folder_name: {
      type: String,
      default: "",
    },
    image_url: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

const Folder = mongoose.model('folder', folderSchema);

export default Folder;
