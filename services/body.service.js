import Body from "../models/body.model.js";
import Folder from "../models/folder.model.js";
import PanelDetails from "../models/panelDetails.model.js";
import User from "../models/user.model.js";
import { uploadToCloudflare } from "../helper/uploadCloudFlare.js";

export const createBodyService = async (body, file, panelDetailsId) => {
  const { folderId, imagePosition, imageClass, bodyVariant  } = body;

  // 1. Validate PanelDetails
  const panelDetails = await PanelDetails.findById(panelDetailsId);
  if (!panelDetails) throw new Error("PanelDetails not found");

  // 2. Validate Folder
  const folder = await Folder.findById(folderId);
  if (!folder) throw new Error("Folder not found");

  // 3. Validate User (from PanelDetails)
  const user = await User.findById(panelDetails.userId);
  if (!user) throw new Error("User not found");

  // 4. Determine imagePosition if not provided
  if (
    imagePosition === undefined ||
    imagePosition === null ||
    imagePosition === ""
  ) {
    // No position provided → put at the end
    const maxPosDoc = await Body.find({ panelDetailsId })
      .sort({ imagePosition: -1 })
      .limit(1);
    const maxPos = maxPosDoc.length ? maxPosDoc[0].imagePosition : 0;
    imagePosition = maxPos + 1;
  } else {
    // Position given → shift other positions down
    await Body.updateMany(
      { panelDetailsId, imagePosition: { $gte: Number(imagePosition) } },
      { $inc: { imagePosition: 1 } }
    );
  }

  // 5. Upload Image
  if (!file) throw new Error("Image is required");
  const result = await uploadToCloudflare(
    file,
    user.cloud_account_id,
    user.cloud_auth
  );
  const imageId = result?.result?.id || "";

  // 6. Save Body
  const newBody = new Body({
    panelDetailsId,
    folderId,
    bodyVariant: bodyVariant || "MainImage", // Default if not given
    image: imageId,
    imagePosition: imagePosition ?? null,
    imageClass: imageClass || "no",
  });

  const saved = await newBody.save();

  return {
    message: "Body created successfully",
    body: saved,
  };
};

export const updateBodyService = async (bodyId, body, file) => {
  let { imagePosition, imageClass, folderId,bodyVariant  } = body;

  // 1. Validate Body
  const existingBody = await Body.findById(bodyId);
  if (!existingBody) throw new Error("Body not found");

  // 2. Validate PanelDetails
  const panelDetails = await PanelDetails.findById(existingBody.panelDetailsId);
  if (!panelDetails) throw new Error("PanelDetails not found");

  // 3. Validate User (from PanelDetails)
  const user = await User.findById(panelDetails.userId);
  if (!user) throw new Error("User not found");

  // 4. If folderId is provided, validate it
  if (folderId) {
    const folder = await Folder.findById(folderId);
    if (!folder) throw new Error("Folder not found");
    existingBody.folderId = folderId;
  }

  if (bodyVariant) {
    existingBody.bodyVariant = bodyVariant;
  }

  // 5. Handle imagePosition changes
  if (
    imagePosition !== undefined &&
    imagePosition !== null &&
    imagePosition !== ""
  ) {
    imagePosition = Number(imagePosition);

    if (imagePosition !== existingBody.imagePosition) {
      if (imagePosition > existingBody.imagePosition) {
        await Body.updateMany(
          {
            panelDetailsId: existingBody.panelDetailsId,
            imagePosition: { $gt: existingBody.imagePosition, $lte: imagePosition },
          },
          { $inc: { imagePosition: -1 } }
        );
      } else {
        await Body.updateMany(
          {
            panelDetailsId: existingBody.panelDetailsId,
            imagePosition: { $gte: imagePosition, $lt: existingBody.imagePosition },
          },
          { $inc: { imagePosition: 1 } }
        );
      }
    }
    existingBody.imagePosition = imagePosition;
  }

  // 6. Upload new image if provided
  if (file) {
    const result = await uploadToCloudflare(
      file,
      user.cloud_account_id,
      user.cloud_auth
    );
    existingBody.image = result?.result?.id || "";
  }

  // 7. Update imageClass if provided
  if (imageClass) {
    existingBody.imageClass = imageClass;
  }

  const updated = await existingBody.save();

  return {
    message: "Body updated successfully",
    body: updated,
  };
};

export const getBodyService = async (panelDetailsId) => {
  // 1. Check if PanelDetails exists
  const panelDetails = await PanelDetails.findById(panelDetailsId);
  if (!panelDetails) throw new Error("PanelDetails not found");

  // 2. Get all bodies for this panel and populate website_name
  const bodies = await Body.find({ panelDetailsId })
    .populate({
      path: "panelDetailsId",
      select: "website_name",
      populate: {
        path: "userId",
        model: "User",
        select: "cloud_account_id cloud_auth cloud_image_url", // choose fields you want
      }
    })
    .populate({
      path: "folderId",
      select: "image_url folder_name",
    })
    .sort({ imagePosition: 1 });

  return {
    message: "Bodies fetched successfully",
    bodies,
  };
};

export const deleteBodyService = async (bodyId) => {
  // 1. Check if Body exists
  const body = await Body.findById(bodyId);
  if (!body) throw new Error("Body not found");

  const { panelDetailsId, imagePosition } = body;

  // 2. Delete the body
  await Body.findByIdAndDelete(bodyId);

  // 3. Update positions of remaining bodies for same panelDetailsId
  await Body.updateMany(
    {
      panelDetailsId,
      imagePosition: { $gt: imagePosition }
    },
    { $inc: { imagePosition: -1 } }
  );

  return {
    message: "Body deleted successfully and positions updated",
    bodyId,
  };
};
