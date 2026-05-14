const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    await authService.registerUser(req.body);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    res.json({
      token: result.token,
      role: result.user.role,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    // Assuming you have auth middleware that attaches user to req
    if (req.user) {
      await authService.logoutUser(req.user.id);
    }
    res.json({ message: "Logged out and status reset successfully" });
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
};
