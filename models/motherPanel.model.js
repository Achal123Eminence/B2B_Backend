import mongoose from "mongoose";

const motherPanelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mother_panel: { type: String, required: true, unique: true }
}, {
  timestamps: true
});

const MotherPanel = mongoose.model('MotherPanel', motherPanelSchema);

export default MotherPanel;
