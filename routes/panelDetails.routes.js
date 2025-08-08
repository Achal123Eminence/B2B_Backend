import express from "express";
import { createPanelDetails, getPanelDetails, removePanelDetails, updatePanelDetails,getSinglePanelDetails } from "../controllers/panelDetails.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { upload } from "../helper/multer.js";

const panelDetailsRouter = express.Router();

panelDetailsRouter.post(
  '/createPanelDetails',
  authenticate,
  upload.fields([
    { name: 'website_logo', maxCount: 1 },
    { name: 'website_logo_second', maxCount: 1 },
    { name: 'website_logo_web', maxCount: 1 },
    { name: 'website_logo_mobile', maxCount: 1 },
    { name: 'website_favicon', maxCount: 1 },
  ]),
  createPanelDetails
);
panelDetailsRouter.get('/getPanelDetails', authenticate, getPanelDetails);
panelDetailsRouter.delete('/remove/:id', authenticate, removePanelDetails );
panelDetailsRouter.put(
  '/updatePanelDetails/:panelDetailsId',
  authenticate,
  upload.fields([
    { name: 'website_logo', maxCount: 1 },
    { name: 'website_logo_second', maxCount: 1 },
    { name: 'website_logo_web', maxCount: 1 },
    { name: 'website_logo_mobile', maxCount: 1 },
    { name: 'website_favicon', maxCount: 1 },
  ]),
  updatePanelDetails
);
panelDetailsRouter.get('/getSingleWebsite', authenticate, getSinglePanelDetails);

export default panelDetailsRouter;