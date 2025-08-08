import MotherPanel from "../models/motherPanel.model.js";
import User from "../models/user.model.js";
import { createMotherPanelService, getMotherPanelListService, updateMotherPanelService, deleteMotherPanelService, getSingleMotherPanelService } from "../services/motherPanel.service.js";
import { createMotherPanelValidation,getMotherPanelListValidation, updateMotherPanelValidation } from "../validations/motherPanel.validation.js";

export const createMotherPanel = async (req, res) => {
  try {
    // Ensure only admins can create a panel
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Validate input
    const { error } = createMotherPanelValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Try to create the mother panel
    const newPanel = await createMotherPanelService(req.body);

    const populatedPanel = await MotherPanel.findById(newPanel._id).populate('userId', 'username');
    console.log(populatedPanel,"populatedPanel")

    return res.status(201).json({
      message: 'Mother panel created successfully',
      panel: {
        id: populatedPanel._id,
        username: populatedPanel.userId.username,
        mother_panel: populatedPanel.mother_panel,
      },
    });
  } catch (error) {
    // Catch service-level or unexpected errors without crashing
    console.error('Create Mother Panel Error:', error.message);
    return res.status(400).json({ error: error.message || 'Something went wrong' });
  }
};

export const getMotherPanel = async (req, res) => {
  try {
    // Ensure only admins can create a panel
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    };
    
    // Validate query params
    const { error, value } = getMotherPanelListValidation.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { _id,page = 1, limit = 10 } = value;

    if (_id) {
      const panel = await getSingleMotherPanelService(_id);
      if (!panel) {
        return res.status(404).json({ message: 'Mother Panel not found' });
      }

      return res.status(200).json({
        message: 'Mother Panel fetched successfully',
        data: panel,
      });
    }
    
    const result = await getMotherPanelListService({ page, limit });

     return res.status(200).json({
      message: 'Mother Panel list fetched successfully',
      data:result,
    });
  } catch (error) {
    console.error("Get Mother Panels Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateMotherPanel = async (req, res) => {
  try {
    // Only admins can update the mother panel
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { id } = req.params;

    // Validate input
    const { error } = updateMotherPanelValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedPanel = await updateMotherPanelService(id, req.body);

    if (!updatedPanel) {
      return res.status(404).json({ error: 'Mother panel not found or no changes applied' });
    }

    return res.status(200).json({
      message: 'Mother panel updated successfully',
    });
  } catch (error) {
    console.error('Update Mother Panel Error:', error.message);
    return res.status(400).json({ error: error.message || 'Something went wrong' });
  }
};

export const deleteMotherPanel = async (req, res) => {
  try {
    // Ensure only admins can delete a panel
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { id } = req.params;

    const deletedPanel = await deleteMotherPanelService(id);

    return res.status(200).json({
      message: 'Mother panel deleted successfully',
    });
  } catch (error) {
    console.error('Delete Mother Panel Error:', error.message);
    return res.status(400).json({ error: error.message || 'Something went wrong' });
  }
};