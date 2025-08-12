import { createBannerService, getBannersByPanelDetailsService, removeBannerService, updateBannerService } from "../services/banner.service.js";
import { createBannerValidation, updateBannerValidation } from "../validations/banner.validation.js";

export const createBanner = async (req, res) => {
  try {
    // Ensure only admins can create a panel
    if (req.user?.type !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    const { panelDetailsId } = req.params;

    const { error } = createBannerValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const result = await createBannerService(
      req.body,
      req.file,
      panelDetailsId
    );
    return res.status(201).json(result);
  } catch (err) {
    console.error("Create Banner Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const getBannersByPanelDetails = async (req, res) => {
  try {
    // Ensure only admins can create a panel
    if (req.user?.type !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const { panelDetailsId } = req.params;

    const banners = await getBannersByPanelDetailsService(panelDetailsId);
    res.status(200).json({
      message: 'Banners fetched successfully',
      data:banners
    });
  } catch (err) {
    console.error('Get Banners Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const removeBanner = async (req,res) => {
  try {
    // Ensure only admins can create a panel
    if (req.user?.type !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const { bannerId } = req.params;
    const result = await removeBannerService(bannerId);

    return res.status(200).json({
      message: 'Banner deleted successfully',
    });
    
  } catch (error) {
    console.error('Delete Banners Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

export const updateBanner = async (req, res) => {
  try {
    if (req.user?.type !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const { bannerId } = req.params;

    const { error } = updateBannerValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const result = await updateBannerService(bannerId, req.body, req.file);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Update Banner Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
