import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { createMotherPanel, getMotherPanel, updateMotherPanel,deleteMotherPanel } from '../controllers/motherPanel.controller.js';

const motherPanelRouter = express.Router();

motherPanelRouter.post('/create', authenticate, createMotherPanel);
motherPanelRouter.get('/get-list', authenticate, getMotherPanel);
motherPanelRouter.put('/update/:id', authenticate, updateMotherPanel);
motherPanelRouter.delete('/remove/:id', authenticate, deleteMotherPanel)

export default motherPanelRouter;