import { createPanelDetailsService, getPanelDetailsService, deletePanelDetailsService, updatePanelDetailsService, getSinglePanelDetailService } from "../services/panelDetails.service.js";
import { createPanelDetailsValidation, getPanelDetailsValidation, updatePanelDetailsValidation } from "../validations/panelDetails.validation.js";

export const createPanelDetails = async (req, res) => {
  try {
    // Ensure only admins can create a panel
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Validate body
    const { error } = createPanelDetailsValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const result = await createPanelDetailsService(req.body, req.files);
    return res.status(201).json(result);

  } catch (err) {
    console.error('Create PanelDetails Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const getPanelDetails = async (req, res) => {
  try {
    // Ensure only admins can create a panel
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    };

    const { error } = getPanelDetailsValidation.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { panelId, page = 1, limit = 10 } = req.query;

    const result = await getPanelDetailsService(panelId, parseInt(page), parseInt(limit));
    return res.status(200).json(result);

  } catch (err) {
    console.error('Get PanelDetails Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const removePanelDetails = async (req, res) => {
  try {
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid or missing ID parameter' });
    }

    const result = await deletePanelDetailsService(id);
    return res.status(200).json(result);
    
  } catch (err) {
    console.error('Delete PanelDetails Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const updatePanelDetails = async (req, res) => {
  try {
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { error } = updatePanelDetailsValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const result = await updatePanelDetailsService(req.params.panelDetailsId, req.body, req.files);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Update PanelDetails Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const getSinglePanelDetails = async (req,res)=>{
  try {
    // Ensure only admins can create a panel
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    };

    const { panelId } = req.query;

    const panel = await getSinglePanelDetailService(panelId);
    if (!panel) {
      return res.status(404).json({ message: "Panel details not found" });
    }

    return res.status(200).json({
      message: "Panel details fetched successfully",
      data: panel,
    });
  } catch (error) {
    console.error('Get Panel Details Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}