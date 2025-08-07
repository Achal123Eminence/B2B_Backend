import { uploadToCloudflare } from "../helper/uploadCloudFlare.js";
import MotherPanel from "../models/motherPanel.model.js";
import PanelDetails from "../models/panelDetails.model.js";
import User from "../models/user.model.js";

export const createPanelDetailsService = async (body, files) => {
  const { userId, panelId, website_name, website_url, refresh_endpoint_url,website_logo_variant, website_logo_web_variant, website_logo_mobile_variant, website_favicon_variant } = body;

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const panel = await MotherPanel.findById(panelId);
  if (!panel) throw new Error('Mother panel not found');

  const existing = await PanelDetails.findOne({ panelId, website_name });
  if (existing) throw new Error('Panel detail with this website name already exists');

  const uploadedImages = {};
  const uploadFields = ['website_logo', 'website_logo_web', 'website_logo_mobile', 'website_favicon'];

  for (const field of uploadFields) {
    if (files && files[field]) {
      const file = files[field][0];
      const result = await uploadToCloudflare(file, user.cloud_account_id, user.cloud_auth);
      uploadedImages[field] = result?.result?.id || '';
    }
  }

  const newPanelDetail = new PanelDetails({
    userId,
    panelId,
    website_name:website_name.toLowerCase(),
    website_url,
    refresh_endpoint_url,
    ...uploadedImages,
    website_logo_variant: website_logo_variant?.trim() ? website_logo_variant : "Logo",
    website_logo_web_variant: website_logo_web_variant?.trim() ? website_logo_web_variant : "LoginImage",
    website_logo_mobile_variant: website_logo_mobile_variant?.trim() ? website_logo_mobile_variant : "MloginImage",
    website_favicon_variant: website_favicon_variant?.trim() ? website_favicon_variant : "Favicon"
  });

  const savedDetail = await newPanelDetail.save();

  return {
    message: 'Panel details created successfully',
    panelDetails: savedDetail
  };
};

export const getPanelDetailsService = async (panelId, page, limit) => {
  const skip = (page - 1) * limit;

  const [total, panelDetails] = await Promise.all([
    PanelDetails.countDocuments({ panelId }),
    PanelDetails.find({ panelId })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'email username cloud_account_id cloud_auth cloud_image_url') // adjust fields as per your user schema
      .populate('panelId', 'mother_panel') // adjust fields as per your user schema
      .sort({ createdAt: -1 })
  ]);

  return {
    message: 'Panel details fetched successfully',
    total,
    page,
    limit,
    data: panelDetails
  };
};

export const deletePanelDetailsService = async (id) => {
  const panel = await PanelDetails.findById(id);
  if (!panel) {
    throw new Error('Panel detail not found');
  }

  await PanelDetails.findByIdAndDelete(id);

  return {
    message: 'Panel details deleted successfully',
    deletedPanelId: id
  };
};