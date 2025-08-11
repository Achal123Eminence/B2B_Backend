import mongoose from "mongoose";

const inplaySchema = new mongoose.Schema({
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
  cricket_image: {
    type: String,
    default: ""
  },
  cricket_variant: {
    type: String,
    default: "inplayforvelki"
  },
  virtual_image: {
    type: String,
    default: ""
  },
  virtual_variant: {
    type: String,
    default: "inplayforvelki"
  },
  football_image: {
    type: String,
    default: ""
  },
  football_variant: {
    type: String,
    default: "inplayforvelki"
  },
  tennis_image: {
    type: String,
    default: ""
  },
  tennis_variant: {
    type: String,
    default: "inplayforvelki"
  }
}, {
  timestamps: true
});

const Inplay = mongoose.model('inplay', inplaySchema);

export default Inplay;
