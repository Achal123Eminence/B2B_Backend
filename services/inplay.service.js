import { uploadToCloudflare } from "../helper/uploadCloudFlare.js";
import Inplay from "../models/inplay.model.js";
import PanelDetails from "../models/panelDetails.model.js";
import User from "../models/user.model.js";

export const addOrUpdateInplayService = async (body, files) => {
  const { cricket_variant, virtual_variant, football_variant, tennis_variant, userId, panelDetailsId } = body;

  // Check panelDetails exists
  const panelDetails = await PanelDetails.findById(panelDetailsId);
  if (!panelDetails) throw new Error('PanelDetails not found');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Prepare uploaded images object
  const uploadedImages = {};
  const uploadFields = ['cricket_image', 'virtual_image', 'football_image', 'tennis_image'];

  for (const field of uploadFields) {
    if (files && files[field]) {
      const file = files[field][0];
      const result = await uploadToCloudflare(file, user.cloud_account_id, user.cloud_auth);
      uploadedImages[field] = result?.result?.id || '';
    }
  }

  // Find existing inplay for this panelDetails
  let inplay = await Inplay.findOne({ panelDetailsId });

  if (!inplay) {
    // Create new
    inplay = new Inplay({
      panelDetailsId,
      userId: user._id,
      ...uploadedImages,
      cricket_variant: cricket_variant?.trim() || "inplayforvelki",
      virtual_variant: virtual_variant?.trim() || "inplayforvelki",
      football_variant: football_variant?.trim() || "inplayforvelki",
      tennis_variant: tennis_variant?.trim() || "inplayforvelki",
    });

    const saved = await inplay.save();
    return { message: 'Inplay created successfully', inplay: saved };
  } else {
    // Update only provided fields
    if (cricket_variant !== undefined) inplay.cricket_variant = cricket_variant;
    if (virtual_variant !== undefined) inplay.virtual_variant = virtual_variant;
    if (football_variant !== undefined) inplay.football_variant = football_variant;
    if (tennis_variant !== undefined) inplay.tennis_variant = tennis_variant;

    // Merge new images if uploaded
    for (const [key, value] of Object.entries(uploadedImages)) {
      if (value) inplay[key] = value;
    }

    const updated = await inplay.save();
    return { message: 'Inplay updated successfully', inplay: updated };
  }
};