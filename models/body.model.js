import mongoose from "mongoose";

const bodySchema = new mongoose.Schema({
  panelDetailsId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'PanelDetails'
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'folder'
  },
  image: {
    type: String,
    required: true // Cloudflare image ID
  },
  imagePosition: {
    type: Number,
    required: true
  },
  bodyVariant: {
    type: String,
    enum: ['MainImage', 'ClassImage'],
    default: "MainImage",
    required: true,
  },
  imageClass: {
    type: String,
    enum: ['no', 'entrance-half'],
    required: true,
    default: 'no'
  }
}, {
  timestamps: true
});

const Body = mongoose.model('Body', bodySchema);
export default Body;
