const User = require("../models/UserModel");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/token");
const Notification = require("../models/notification.model");

exports.registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error("User already exists");

  const hashed = await hashPassword(data.password);

  const user = await User.create({
    ...data,
    password: hashed,
    verification: {
      isVerified: data.role === "jobseeker" ? true : false,
      status: data.role === "jobseeker" ? "approved" : "pending",
      verifiedAt: data.role === "jobseeker" ? new Date() : null
    }
  });

  // Notify Admins about new registration
  try {
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        message: `New user registered: ${user.name} (${user.email}) as ${user.role}`,
        type: "registration"
      });
    }
  } catch (err) {
    console.error("Failed to send registration notification:", err);
  }

  return user;
};

exports.loginUser = async (email, password) => {
  // SUPER ADMIN BYPASS FOR PRESENTATION
  if (email === "admin@careergrid.com" && password === "admin123") {
    const adminUser = {
      _id: "admin_id_007",
      name: "Global Administrator",
      email: "admin@careergrid.com",
      role: "admin",
      verification: { isVerified: true }
    };
    const token = generateToken(adminUser);
    return { user: adminUser, token };
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = generateToken(user);

  // Notify Admins about new login (except for admins themselves to avoid spam)
  if (user.role !== "admin") {
    try {
      const admins = await User.find({ role: "admin" });
      for (const admin of admins) {
        await Notification.create({
          user: admin._id,
          message: `User logged in: ${user.name} (${user.email})`,
          type: "login"
        });
      }
    } catch (err) {
      console.error("Failed to send login notification:", err);
    }
  }

  return { user, token };
};

exports.logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (user && user.role === "employer") {
    user.verification.isVerified = false;
    user.verification.status = "pending";
    user.verification.verifiedAt = null;
    await user.save();
  }
};
