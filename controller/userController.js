import uploadOnCloudinary from '../config/cloudinary.js';
import userModel from '../models/userModel.js';

export const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `GetCurrentUser error: ${error.message}` });
  }
};

export const updateprofile = async (req, res) => {
  try {
    const userId = req.userId;
    const { description, name } = req.body;

    let photoUrl;
    if (req.file) {
      photoUrl = await uploadOnCloudinary(req.file.path);
    }

    const updateData = { name, description };
    if (photoUrl) updateData.photoUrl = photoUrl;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not Found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: `updateprofile error: ${error.message}` });
  }
};
