import { uploadToCloudflare } from "../helper/uploadCloudFlare.js";
import Banner from "../models/banner.model.js";
import PanelDetails from "../models/panelDetails.model.js";
import User from "../models/user.model.js";

export const createBannerService = async(body, file, panelDetailsId) => {
    const { banner_variant, image_type } = body;

    console.log(panelDetailsId,"panelDetailsId")
    const panelDetails = await PanelDetails.findById(panelDetailsId);
    if (!panelDetails) throw new Error('PanelDetails not found');

    const user = await User.findById(panelDetails.userId);
    if (!user) throw new Error('User not found');

    let banner = "";

    if (!file) throw new Error("Banner image is required for non-csv type");

    const result = await uploadToCloudflare(
      file,
      user.cloud_account_id,
      user.cloud_auth
    );
    
    banner = result?.result?.id || "";

    const newBanner = new Banner({
      panelDetailsId,
      userId: user._id,
      banner,
      banner_variant: banner_variant?.trim() || "Banner",
      image_type,
    });

    const saved = await newBanner.save();

    return {
      message: "Banner added successfully",
      banner: saved,
    };
}

export const getBannersByPanelDetailsService = async (panelDetailsId) => {
  const panelDetails = await PanelDetails.findById(panelDetailsId);
  if (!panelDetails) throw new Error("Panel Details not found");

  const banners = await Banner.find({ panelDetailsId })
    .populate({
      path: "userId",
      select: "username cloud_account_id cloud_auth cloud_image_url", // Add fields as per your requirement
    })
    .populate({
      path: "panelDetailsId",
      select: "website_name website_url", // Add fields as per your requirement
    })
    .sort({ createdAt: -1 });
  return banners;
};