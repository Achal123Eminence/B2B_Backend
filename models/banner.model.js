import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  panelDetailsId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'PanelDetails'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  banner: {
    type: String,
    default: ""
  },
  banner_variant: {
    type: String,
    default: "Banner"
  },
  image_type: {
    type: String,
    enum: ['csv', 'image'],
    required: true
  }
}, {
  timestamps: true
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
