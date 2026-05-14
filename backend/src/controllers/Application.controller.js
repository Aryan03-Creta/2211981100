const Application = require("../models/Application.model");
const Job = require("../models/Job.model");
const User = require("../models/UserModel");
const Notification = require("../models/notification.model");


// =============================
// 1️⃣ Apply for Job
// =============================
exports.applyJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.jobId)
      .populate("employer");

    if (!job)
      return res.status(404).json({ error: "Job not found" });

    // Prevent employer from applying
    if (req.user.role === "employer")
      return res.status(403).json({ error: "Employers cannot apply to jobs" });

    // Prevent duplicate application
    const existing = await Application.findOne({
      job: job._id,
      applicant: req.user.id,
    });

    if (existing)
      return res.status(400).json({ error: "Already applied to this job" });

    // Resume upload
    let resume = req.file ? req.file.path : null;
    if (resume) {
      resume = resume.replace(/\\/g, "/");
      if (resume.includes("uploads/")) {
        resume = "uploads/" + resume.split("uploads/")[1];
      }
    }

    // Create application with form data
    const application = await Application.create({
      job: job._id,
      applicant: req.user.id,

      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,

      city: req.body.city,
      country: req.body.country,

      experience: req.body.experience,
      currentCompany: req.body.currentCompany,

      expectedSalary: req.body.expectedSalary,
      noticePeriod: req.body.noticePeriod,

      skills: req.body.skills,
      coverLetter: req.body.coverLetter,

      resume,

      status: "applied",
    });

    // Increase applicant count
    await Job.updateOne(
      { _id: job._id },
      { $inc: { applicantsCount: 1 } }
    );

    const applicant = await User.findById(req.user.id);

    // Create notification for employer
    await Notification.create({
      user: job.employer._id,
      message: `${applicant.name} applied for ${job.title}`,
      type: "application",
    });

    // Create notification for jobseeker
    await Notification.create({
      user: req.user.id,
      message: `You successfully applied for ${job.title} at ${job.companyName}`,
      type: "application",
    });

    res.json({
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =============================
// 2️⃣ Get My Applications (Jobseeker)
// =============================
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// =============================
// 3️⃣ Get Applicants For A Job (Employer)
// =============================
exports.getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job)
      return res.status(404).json({ error: "Job not found" });

    // Ensure only job owner can view applicants
    if (job.employer.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    const applications = await Application.find({
      job: job._id,
    })
      .populate("applicant", "name email profile")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// =============================
// 4️⃣ Update Application Status (Accept / Reject)
// =============================
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const application = await Application.findById(req.params.applicationId)
      .populate("job")
      .populate("applicant");

    if (!application)
      return res.status(404).json({ error: "Application not found" });

    // Only employer of job can update status
    if (application.job.employer.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    application.status = status;
    await application.save();

    // Notify applicant
    await Notification.create({
      user: application.applicant._id,
      message: `Your application for ${application.job.title} was ${status}`,
      type: "application-status",
    });

    res.json({
      message: `Application ${status}`,
      application,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};