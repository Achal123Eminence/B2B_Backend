import { uploadToCloudflare } from "../helper/uploadCloudFlare.js";
import MotherPanel from "../models/motherPanel.model.js";
import PanelDetails from "../models/panelDetails.model.js";
import User from "../models/user.model.js";
import Banner from "../models/banner.model.js";
import Inplay from "../models/inplay.model.js";
import Body from "../models/body.model.js";

export const createPanelDetailsService = async (body, files) => {
  const { userId, panelId, website_name, website_url, refresh_endpoint_url,website_logo_variant,website_logo_variant_second, website_logo_web_variant, website_logo_mobile_variant, website_favicon_variant } = body;

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const panel = await MotherPanel.findById(panelId);
  if (!panel) throw new Error('Mother panel not found');

  const existing = await PanelDetails.findOne({ panelId, website_name });
  if (existing) throw new Error('Panel detail with this website name already exists');

  const uploadedImages = {};
  const uploadFields = ['website_logo', 'website_logo_second', 'website_logo_web', 'website_logo_mobile', 'website_favicon'];

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
    website_logo_variant_second: website_logo_variant_second?.trim() ? website_logo_variant_second : "Logo",
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

export const updatePanelDetailsService = async (panelDetailsId, body, files) => {
  const panelDetails = await PanelDetails.findById(panelDetailsId);
  if (!panelDetails) throw new Error('PanelDetails not found');

  const user = await User.findById(panelDetails.userId);
  if (!user) throw new Error('User not found');

  const updates = {};
  if (body.website_name) updates.website_name = body.website_name.toLowerCase();
  if (body.website_url) updates.website_url = body.website_url;
  if (body.refresh_endpoint_url) updates.refresh_endpoint_url = body.refresh_endpoint_url;
  if (body.website_logo_variant !== undefined) updates.website_logo_variant = body.website_logo_variant?.trim() || 'Logo';
  if (body.website_logo_variant_second !== undefined) updates.website_logo_variant_second = body.website_logo_variant_second?.trim() || 'Logo';
  if (body.website_logo_web_variant !== undefined) updates.website_logo_web_variant = body.website_logo_web_variant?.trim() || 'LoginImage';
  if (body.website_logo_mobile_variant !== undefined) updates.website_logo_mobile_variant = body.website_logo_mobile_variant?.trim() || 'MloginImage';
  if (body.website_favicon_variant !== undefined) updates.website_favicon_variant = body.website_favicon_variant?.trim() || 'Favicon';

  const uploadFields = ['website_logo','website_logo_second', 'website_logo_web', 'website_logo_mobile', 'website_favicon'];
  for (const field of uploadFields) {
    if (files && files[field]) {
      const file = files[field][0];
      const result = await uploadToCloudflare(file, user.cloud_account_id, user.cloud_auth);
      updates[field] = result?.result?.id || '';
    }
  }

  const updated = await PanelDetails.findByIdAndUpdate(panelDetailsId, updates, { new: true });

  return {
    message: 'Panel details updated successfully',
    panelDetails: updated,
  };
};

// service.js
export const getSinglePanelDetailService = async (_id) => {
  return await PanelDetails.findById(_id)
    .populate({
      path: 'panelId',
      select: 'username email'
    });
};

// helper to build image URL
const buildImageUrl = (base, id, variant, version) => {
  if (!id || !variant) return "";
  return `${base}${id}/${variant}?${version}`;
};

export const getPanelDetailAllDataService = async (website_url) => {
  // Fetch panel details first
  const panelDetails = await PanelDetails.findOne({
    website_url: website_url.toLowerCase()
  })
    .populate({ path: "userId", select: "cloud_image_url -_id" })
    .lean();

  if (!panelDetails) {
    throw new Error("Panel details not found");
  }

  const { _id: panelDetailsId, userId, website_version } = panelDetails;
  const baseUrl = userId.cloud_image_url;

  // Run all other DB queries in parallel
  const [banners, inplayData, bodyData] = await Promise.all([
    Banner.find({ panelDetailsId })
      .select("banner banner_variant")
      .populate({ path: "userId", select: "cloud_image_url -_id" })
      .lean(),

    Inplay.findOne({ panelDetailsId })
      .select("cricket_image cricket_variant virtual_image virtual_variant football_image football_variant tennis_image tennis_variant")
      .populate({ path: "userId", select: "cloud_image_url -_id" })
      .lean(),

    Body.find({ panelDetailsId })
      .populate({
        path: "folderId",
        select: "folder_name image_url -_id"
      })
      .populate({
        path: "panelDetailsId",
        select: "website_name userId",
        populate: {
          path: "userId",
          model: "User",
          select: "cloud_image_url -_id"
        }
      })
      .lean()
  ]);

  // Headers
  const headers = [{
    logo: buildImageUrl(baseUrl, panelDetails.website_logo, panelDetails.website_logo_variant, website_version),
    second_logo: buildImageUrl(baseUrl, panelDetails.website_logo_second, panelDetails.website_logo_variant_second, website_version),
    web_login_image: buildImageUrl(baseUrl, panelDetails.website_logo_web, panelDetails.website_logo_web_variant, website_version),
    mobile_login_image: buildImageUrl(baseUrl, panelDetails.website_logo_mobile, panelDetails.website_logo_mobile_variant, website_version),
    favicon: buildImageUrl(baseUrl, panelDetails.website_favicon, panelDetails.website_favicon_variant, website_version)
  }];

  // Banners
  const bannerList = banners.map(b =>
    ({ banner_images: buildImageUrl(b.userId.cloud_image_url, b.banner, b.banner_variant, website_version) })
  );

  // Inplay
  const inplayList = inplayData ? [{
    cricket: buildImageUrl(inplayData.userId.cloud_image_url, inplayData.cricket_image, inplayData.cricket_variant, website_version),
    virtual: buildImageUrl(inplayData.userId.cloud_image_url, inplayData.virtual_image, inplayData.virtual_variant, website_version),
    football: buildImageUrl(inplayData.userId.cloud_image_url, inplayData.football_image, inplayData.football_variant, website_version),
    tennis: buildImageUrl(inplayData.userId.cloud_image_url, inplayData.tennis_image, inplayData.tennis_variant, website_version)
  }] : [];

  // Body
  const bodyList = bodyData.map(body => ({
    image_title: body.folderId.folder_name,
    image_url: body.folderId.image_url,
    image_class: body.imageClass,
    images: buildImageUrl(
      body.panelDetailsId.userId.cloud_image_url,
      body.image,
      body.bodyVariant,
      website_version
    )
  }));

  // Final structure
  return {
    domain: panelDetails.website_url,
    headers,
    banners: bannerList,
    main_content: bodyList,
    inplay: inplayList
  };
};
