import { createFolderService, getFolderService, deleteFolder, updateFolderService, copyFoldersService, getFolderListDataService } from "../services/folder.service.js";
import { createFolderValidation, getFolderListValidation, updateFolderValidation, copyFoldersValidation } from "../validations/folder.validation.js";

export const createFolder = async (req,res) => {
    try {
      // Ensure only admins can create a panel
      if (req.user?.type !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only." });
      }

      // Validate input
      const { error } = createFolderValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const result =  await createFolderService(req.body);
      return res.status(201).json(result);

    } catch (error) {
        console.error('Create Folder Error:', error.message);
        return res.status(400).json({ error: error.message || 'Something went wrong' });
    }
}

export const getFolder = async (req,res) => {
    try {
        // Ensure only admins can create a panel
        if (req.user?.type !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        const { error, value } = getFolderListValidation.validate(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { page = 1, limit = 100 } = value;
        
        const result = await getFolderService({ page, limit});

        return res.status(200).json({
            message: 'Folder list fetched successfully',
            data:result?.folders
        });
    } catch (error) {
        console.error("Get Folder List Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const removeFolder = async (req,res) => {
    try {
        // Ensure only admins can create a panel
        if (req.user?.type !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        const { folderId } = req.params;
        if(!folderId){
            return res.status(400).json({ error: "FolderId is required in params" });
        }
        const result = await deleteFolder(folderId);

        return res.status(200).json({message:"Folder deleted successfully",data:folderId});
    } catch (error) {
        console.error('Delete Banners Error:', err.message);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
}

export const updateFolder = async (req,res) => {
    try {
        if (req.user?.type !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }
        const { error } = updateFolderValidation.validate(req.body);
        if(error) return res.status(400).json({error: error.details[0].message});
        
        const { folderId } = req.params;
        if(!folderId){
            return res.status(400).json({ error: "FolderId is required in params" });
        };

        const result = await updateFolderService(folderId,req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Update Folder Error:', error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

export const copyFolders = async (req, res) => {
  try {
    // Ensure only admins can copy folders
    if (req.user?.type !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Validate input
    const { error } = copyFoldersValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await copyFoldersService(req.body);
    return res.status(201).json(result);

  } catch (error) {
    console.error('Copy Folders Error:', error.message);
    return res.status(400).json({ error: error.message || 'Something went wrong' });
  }
};

export const getFolderListData = async (req, res) => {
  try {
    if (req.user?.type !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    const { panelDetailsId } = req.params;
    if (!panelDetailsId) {
      return res
        .status(400)
        .json({ error: "panelDetailsId is required in params" });
    }
    
    const folderList = await getFolderListDataService(panelDetailsId);
    return res.status(200).json({ folders: folderList });
  } catch (err) {
    console.error("Get Folder List Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};