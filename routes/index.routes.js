import express from "express";
import userRouter from './user.routes.js';
import motherPanelRouter from "./motherPanel.routes.js";
import panelDetailsRouter from "./panelDetails.routes.js";
import bannerRouter from "./banner.routes.js";
import inplayRouter from "./inplay.routes.js";
import folderRouter from "./folder.routes.js";
import bodyRouter from "./body.routes.js";

const router = express.Router();

router.use('/user',userRouter);
router.use('/mother-panel',motherPanelRouter);
router.use('/details',panelDetailsRouter);
router.use('/banner',bannerRouter);
router.use('/inplay',inplayRouter);
router.use('/folder',folderRouter);
router.use('/body',bodyRouter)

export default router;