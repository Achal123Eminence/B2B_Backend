import express from "express";
import { createBody, updateBody, getBody, removeBody } from "../controllers/body.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { upload } from "../helper/multer.js";

const bodyRouter = express.Router();

bodyRouter.post('/add/:panelDetailsId',authenticate, upload.single('image'), createBody);
bodyRouter.put('/update/:bodyId',authenticate, upload.single('image'), updateBody);
bodyRouter.get('/get/:panelDetailsId',authenticate,getBody);
bodyRouter.delete('/remove/:bodyId',authenticate,removeBody);

export default bodyRouter;