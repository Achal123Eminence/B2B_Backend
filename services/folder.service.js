import Folder from "../models/folder.model.js";
import MotherPanel from "../models/motherPanel.model.js";

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