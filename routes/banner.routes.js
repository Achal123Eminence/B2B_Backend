import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { upload } from "../helper/multer.js";
import { createBanner,getBannersByPanelDetails, removeBanner, updateBanner } from "../controllers/banner.controller.js";


const bannerRouter = express.Router();

bannerRouter.post('/add/:panelDetailsId',authenticate,upload.single('banner'),createBanner);
bannerRouter.get('/get/:panelDetailsId',authenticate, getBannersByPanelDetails);
bannerRouter.delete('/remove/:bannerId',authenticate, removeBanner);
bannerRouter.put('/update/:bannerId',authenticate , upload.single('banner'), updateBanner);

export default bannerRouter;