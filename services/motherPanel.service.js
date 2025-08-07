import MotherPanel from "../models/motherPanel.model.js";
import User from "../models/user.model.js";

export const createMotherPanelService = async (data) => {
  const { userId, mother_panel } = data;

   // Ensure user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User with this userId does not exist');
  }

  // Check for duplicate mother_panel name
  const existingPanel = await MotherPanel.findOne({ mother_panel: mother_panel.toLowerCase() });
  if (existingPanel) {
    throw new Error('Mother panel with this name already exists');
  }

  const newMotherPanel = new MotherPanel({
    userId: user._id,
    mother_panel: mother_panel.toLowerCase(),
  });

  return await newMotherPanel.save();
};

export const getMotherPanelListService = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  const query = {}; // Add filters if needed

  const [total, panels] = await Promise.all([
    MotherPanel.countDocuments(query),
    MotherPanel.find(query)
      .populate({
        path: 'userId',
        select: 'username email' // Add fields as per your requirement
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
  ]);

  return {
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    items: panels,
  };
};

// service.js
export const getSingleMotherPanelService = async (_id) => {
  return await MotherPanel.findById(_id)
    .populate({
      path: 'userId',
      select: 'username email'
    });
};

export const updateMotherPanelService = async (id, data) => {
  const { userId, mother_panel } = data;

  // Check if user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error('User with this ID does not exist');
  }

  // Check if the new mother_panel name already exists in another document
  const existingPanel = await MotherPanel.findOne({
    mother_panel: mother_panel.toLowerCase(),
    _id: { $ne: id },
  });
  if (existingPanel) {
    throw new Error('Another mother panel with this name already exists');
  }

  const updatedPanel = await MotherPanel.findByIdAndUpdate(
    id,
    {
      userId,
      mother_panel: mother_panel.toLowerCase(),
    },
    { new: true }
  );

  return updatedPanel;
};

export const deleteMotherPanelService = async (id) => {
  const panel = await MotherPanel.findById(id);

  if (!panel) {
    throw new Error('Mother panel not found');
  }

  await panel.deleteOne();

  return panel;
};