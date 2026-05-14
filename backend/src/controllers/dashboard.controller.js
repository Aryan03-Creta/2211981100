const Job = require("../models/Job.model");
const Application = require("../models/Application.model");
const User = require("../models/UserModel");

exports.jobSeekerDashboard = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  const apps = await Application.find({ applicant: req.user.id })
    .populate("job");

  res.json({
    profile: user.profile,
    totalApplications: apps.length,
    applications: apps
  });
};

exports.employerDashboard = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id });
    const jobIds = jobs.map(j => j._id);

    const stats = await Application.aggregate([
      {
        $match: { job: { $in: jobIds } }
      },
      {
        $group: {
          _id: "$job",
          totalApplicants: { $sum: 1 }
        }
      }
    ]);

    res.json({
      jobsPosted: jobs.length,
      jobs,
      stats
    });
  } catch (err) {
    console.error("Error in employerDashboard:", err);
    res.status(500).json({ error: "Server error" });
  }
};
