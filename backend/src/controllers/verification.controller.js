const User = require("../models/UserModel");

exports.requestVerification = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.role !== "employer")
    return res.status(403).json({ error: "Only employers can request verification" });

  if (user.verification.status === "approved")
    return res.status(400).json({ error: "Already verified" });

  user.verification.status = "pending";
  user.verification.requestedAt = new Date();

  await user.save();

  res.json({ message: "Verification request submitted" });
};