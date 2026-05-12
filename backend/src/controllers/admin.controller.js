const User = require("../models/UserModel");

exports.getPendingEmployers = async (req, res) => {
  try {
    const users = await User.find({
      role: "employer",
      $or: [
        { "verification.isVerified": false },
        { "verification.status": "pending" }
      ]
    }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending requests" });
  }
};

exports.verifyEmployer = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).json({ error: "User not found" });

  user.verification = {
    isVerified: true,
    status: "approved",
    verifiedAt: new Date()
  };

  await user.save();

  res.json({ message: "User approved successfully", verification: user.verification });
};


exports.rejectEmployer = async (req, res) => {
  const { reason } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.verification.status = "rejected";
  user.verification.rejectedAt = new Date();
  user.verification.rejectionReason = reason;
  user.verification.isVerified = false;

  await user.save();

  res.json({ message: "User rejected" });
};

