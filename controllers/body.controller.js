import { createBodyService, updateBodyService, getBodyService,deleteBodyService } from "../services/body.service.js";
import { createBodyValidation, updateBodyValidation, deleteBodyValidation } from "../validations/body.validation.js";

export const createBody = async (req, res) => {
  try {
    if (req.user?.type !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const { panelDetailsId } = req.params;
    const { error } = createBodyValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const result = await createBodyService(req.body, req.file, panelDetailsId);
    return res.status(201).json(result);
  } catch (err) {
    console.error("Create Body Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const updateBody = async (req, res, next) => {
  try {
    if (req.user?.type !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const { bodyId } = req.params;

    const { error } = updateBodyValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updated = await updateBodyService(bodyId, req.body, req.file);
    res.status(200).json(updated);
    
  } catch (err) {
    next(err);
  }
};

export const getBody = async (req, res) => {
  try {
    if (req.user?.type !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const { panelDetailsId } = req.params;
    if(!panelDetailsId){
        return res.status(400).json({ error: "panelDetailsId required in params!" });
    }

    const result = await getBodyService(panelDetailsId);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Get Body Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const removeBody = async (req, res) => {
  try {
    if (req.user?.type !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const { bodyId } = req.params;
    const { error } = deleteBodyValidation.params.validate({ bodyId });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const result = await deleteBodyService(bodyId);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Delete Body Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};