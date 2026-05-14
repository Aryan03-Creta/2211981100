const User = require("../models/UserModel");
const { calculateScore } = require("../utils/profileScore");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  const score = calculateScore(user.profile, user.role);
  res.json({user, profileCompletion: score});
};

exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  const { name, ...profileData } = req.body;
  
  if (name) {
    user.name = name;
  }
  
  user.profile = { ...user.profile, ...profileData };

  await user.save();

  const score = calculateScore(user.profile, user.role);

  res.json({ message: "Profile updated", profile: user.profile, profileCompletion: score });
};


exports.uploadResume = async (req, res) => {
  const user = await User.findById(req.user.id);

  let resumePath = req.file.path;
  resumePath = resumePath.replace(/\\/g, "/");
  if (resumePath.includes("uploads/")) {
    resumePath = "uploads/" + resumePath.split("uploads/")[1];
  }
  user.profile.resume = resumePath;
    await user.save();

    res.json({ message: "Resume uploaded", resume: user.profile.resume });
};

exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  const user = await User.findById(req.user.id);
  let avatarPath = req.file.path;
  avatarPath = avatarPath.replace(/\\/g, "/");
  if (avatarPath.includes("uploads/")) {
    avatarPath = "uploads/" + avatarPath.split("uploads/")[1];
  }
  user.profile.avatar = avatarPath;

  await user.save();

  res.json({
    message: "Avatar uploaded",
    avatar: avatarPath,
  });
};
