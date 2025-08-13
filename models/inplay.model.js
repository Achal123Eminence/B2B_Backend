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
    default: "Inplay"
  },
  virtual_image: {
    type: String,
    default: ""
  },
  virtual_variant: {
    type: String,
    default: "Inplay"
  },
  football_image: {
    type: String,
    default: ""
  },
  football_variant: {
    type: String,
    default: "Inplay"
  },
  tennis_image: {
    type: String,
    default: ""
  },
  tennis_variant: {
    type: String,
    default: "Inplay"
  }
}, {
  timestamps: true
});

const Inplay = mongoose.model('inplay', inplaySchema);

export default Inplay;
