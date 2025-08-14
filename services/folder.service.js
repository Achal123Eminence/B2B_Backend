import Folder from "../models/folder.model.js";
import MotherPanel from "../models/motherPanel.model.js";
import PanelDetails from '../models/panelDetails.model.js';

export const createFolderService = async(body) => {
    const { panelId, folder_name, image_url } = body;

    //Ensure mother panel exist
    const motherPanel = await MotherPanel.findById(panelId);
    if(!motherPanel){
        throw new Error("Mother Panel not found!")
    }

    const existingFolder = await Folder.findOne({folder_name:folder_name.toLowerCase()});
    if(existingFolder){
        throw new Error("Folder with this name already exist!")
    };

    const newFolder = new Folder({
        panelId:motherPanel._id,
        folder_name:folder_name.toLowerCase(),
        image_url
    });

    return await newFolder.save();
};

export const getFolderService = async ({page,limit}) => {
    const skip = (page - 1) * limit;

    const [folders, total] = await Promise.all([
      Folder.find().populate({
      path: 'panelId',
      select: 'mother_panel'
    }).skip(skip).limit(limit),
      Folder.countDocuments(),
    ]);

    return {
    folders,
    pagination: {
      totalUsers: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
    },
  };
};

export const deleteFolder = async (folderId) => {
    const folder = await Folder.findById(folderId);
    if(!folder) throw new Error("Folder not found");

    const motherPanel = await MotherPanel.findById(folder.panelId);
    if(!motherPanel) throw new Error("Associated Mother Panel not found");

    await folder.deleteOne();

    return {
        message:"Folder deleted successfully",
        folderId
    }
}

export const updateFolderService = async (folderId, body) => {
    const { panelId, folder_name,image_url} = body;

    const existingFolder =await Folder.findById(folderId);
    if(!existingFolder) throw new Error("Folder not Found or Folder with this name already exist!");

    const motherPanel = await MotherPanel.findById(panelId);
    if(!motherPanel) throw new Error("Mother Panel not found");

    const updatedField = {};

    if(folder_name){
        const duplicateFolder = await Folder.findOne({
            folder_name: folder_name.toLowerCase(),
            _id: { $ne: folderId },
        });
        if(duplicateFolder){
            throw new Error("Folder with this name already exist!")
        };
        updatedField.folder_name = folder_name.toLowerCase();
    }

    if (image_url) updatedField.image_url = image_url;
    if (panelId) updatedField.panelId = panelId;

    const updateFolder = await Folder.findByIdAndUpdate(folderId,updatedField, {new:true});

    return {
        message:"Folder updated successfully",
        updateFolder
    }
}

export const copyFoldersService = async (body) => {
  let { copyFromPanelId, copyToPanelId, importMethod } = body;
  importMethod = Number(importMethod); // ensure numeric

  // Prevent copying into the same panel
  if (copyFromPanelId === copyToPanelId) {
    throw new Error("Source and target panels cannot be the same.");
  }
  
  // Ensure mother panels exist
  const fromPanel = await MotherPanel.findById(copyFromPanelId);
  const toPanel = await MotherPanel.findById(copyToPanelId);

  if (!fromPanel) throw new Error("Source Mother Panel not found!");
  if (!toPanel) throw new Error("Target Mother Panel not found!");

  // Get folders from source panel
  const sourceFolders = await Folder.find({ panelId: fromPanel._id });

  if (sourceFolders.length === 0) {
    throw new Error("No folders found in source panel!");
  }

  // Get existing folders in target panel
  const targetFolders = await Folder.find({ panelId: toPanel._id });
  const targetFolderNames = targetFolders.map(f => f.folder_name.toLowerCase());

  // Filter only unique ones
  const foldersToCopy = sourceFolders.filter(f => 
    !targetFolderNames.includes(f.folder_name.toLowerCase())
  );

  if (foldersToCopy.length === 0) {
    return { message: "No new folders to copy." };
  }

  // Prepare new documents
  const newFolders = foldersToCopy.map(f => ({
    panelId: toPanel._id,
    folder_name: f.folder_name.toLowerCase(),
    image_url: importMethod === 2 ? f.image_url : ""
  }));

  // Insert in bulk
  await Folder.insertMany(newFolders);

  return { 
    message: `${newFolders.length} folder(s) copied successfully.`,
    copiedCount: newFolders.length
  };
};

export const getFolderListDataService = async (panelDetailsId) => {
  // 1. Find the panel detail
  const panel = await PanelDetails.findById(panelDetailsId);
  if (!panel) throw new Error('PanelDetails not found');

  const panelId = panel.panelId;

  // 2. Get folders linked to this panelId
  const folders = await Folder.find({ panelId }).select('folder_name image_url _id');

  return folders;
};

