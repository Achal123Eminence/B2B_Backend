import Inplay from "../models/inplay.model.js";
import { addOrUpdateInplayService } from "../services/inplay.service.js";
import { addOrUpdateInplayValidation } from "../validations/inplay.validation.js";

export const addOrUpdateInplay = async (req, res) => {
  try {
    // Ensure only admins can create/update
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Validate request (all fields optional)
    const { error } = addOrUpdateInplayValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const result = await addOrUpdateInplayService(req.body, req.files);

    return res.status(200).json(result);
  } catch (err) {
    console.error('Add Inplay Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const getSingelInplay = async (req, res) => {
  try {
    const { panelDetailsId } = req.params;

    const inplay = await Inplay.findOne({ panelDetailsId }).populate({
      path: 'userId',
      select: 'cloud_image_url'
    }).lean();

    if (!inplay) {
      return res.status(404).json({ message: 'No Inplay found for this PanelDetails' });
    }

    res.status(200).json({
      message: 'Inplay fetched successfully',
      data:inplay
    });
  } catch (err) {
    console.error('Get Single Inplay Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
