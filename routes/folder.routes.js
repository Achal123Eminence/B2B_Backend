import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { createFolder, getFolder, removeFolder, updateFolder, copyFolders } from "../controllers/folder.controller.js";

const folderRouter = express.Router();

folderRouter.post('/add',authenticate,createFolder);
folderRouter.get('/get', authenticate, getFolder);
folderRouter.delete('/remove/:folderId',authenticate,removeFolder);
folderRouter.put('/update/:folderId',authenticate,updateFolder);
folderRouter.post('/import',authenticate,copyFolders);

export default folderRouter;