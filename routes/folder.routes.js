import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { createFolder, getFolder, removeFolder, updateFolder, copyFolders, getFolderListData } from "../controllers/folder.controller.js";

const folderRouter = express.Router();

folderRouter.post('/add',authenticate,createFolder);
folderRouter.get('/get', authenticate, getFolder);
folderRouter.delete('/remove/:folderId',authenticate,removeFolder);
folderRouter.put('/update/:folderId',authenticate,updateFolder);
folderRouter.post('/import',authenticate,copyFolders);
folderRouter.get('/data-List/:panelDetailsId',authenticate,getFolderListData);

export default folderRouter;