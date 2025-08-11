import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { upload } from "../helper/multer.js";
import { addOrUpdateInplay, getSingelInplay } from "../controllers/inplay.controller.js";

const inplayRouter = express.Router();

inplayRouter.post(
    '/add',
    authenticate,
    upload.fields([
    { name: 'cricket_image', maxCount: 1 },
    { name: 'virtual_image', maxCount: 1 },
    { name: 'football_image', maxCount: 1 },
    { name: 'tennis_image', maxCount: 1 },
  ]),
  addOrUpdateInplay
);
inplayRouter.get('/get/:panelDetailsId',authenticate,getSingelInplay);
export default inplayRouter;