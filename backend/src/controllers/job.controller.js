const Job = require("../models/Job.model");
const Notification = require("../models/notification.model");


// CREATE JOB
exports.createJob = async (req, res) => {
  try {
    // SECURITY CHECK: Only verified employers can post jobs
    if (!req.user.isVerified) {
      return res.status(403).json({ 
        error: "Access Denied", 
        details: "Aapka account abhi Admin se verified nahi hai. Kripya intezar karein ya Admin se sampark karein." 
      });
    }

    let logo = req.file ? req.file.path : undefined;
    if (logo) {
      logo = logo.replace(/\\/g, "/");
      if (logo.includes("uploads/")) {
        logo = "uploads/" + logo.split("uploads/")[1];
      }
    }

    const job = await Job.create({
      ...req.body,
      salaryNumber: req.body.salaryNumber
        ? Number(req.body.salaryNumber)
        : undefined,
      companyLogo: logo,
      employer: req.user.id
    });

    // Create notification for employer
    await Notification.create({
      user: req.user.id,
      message: `Job "${job.title}" has been posted successfully.`,
      type: "job-post"
    });

    // Notify all jobseekers (old and new students) about the new job
    try {
      const User = require("../models/UserModel");
      const jobseekers = await User.find({ role: "jobseeker" });
      const notifications = jobseekers.map(js => ({
        user: js._id,
        message: `New Job Alert: ${job.companyName} is hiring for ${job.title}!`,
        type: "job-alert"
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (err) {
      console.error("Failed to notify jobseekers:", err);
    }

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job
    });

  } catch (error) {
    console.error("Job Creation Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        error: "Validation failed",
        details: messages.join(", ")
      });
    }

    res.status(500).json({
      error: "Internal server error occurred while creating job",
      details: error.message
    });
  }
};



// GET ALL JOBS
exports.getJobs = async (req, res) => {
  try {

    const jobs = await Job.find()
      .populate("employer", "name verification");

    res.json({
      success: true,
      total: jobs.length,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch jobs"
    });
  }
};



// GET SINGLE JOB
exports.getJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id)
      .populate("employer", "name verification");

    if (!job) {
      return res.status(404).json({
        error: "Job not found"
      });
    }

    res.json({
      success: true,
      job
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch job"
    });
  }
};



// UPDATE JOB
exports.updateJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ error: "Job not found" });

    if (job.employer.toString() !== req.user.id)
      return res.status(403).json({ error: "Not your job" });

    let logo = req.file ? req.file.path : undefined;
    if (logo) {
      logo = logo.replace(/\\/g, "/");
      if (logo.includes("uploads/")) {
        logo = "uploads/" + logo.split("uploads/")[1];
      }
    }

    Object.assign(job, req.body);

    if (logo) {
      job.companyLogo = logo;
    }

    await job.save();

    res.json({
      success: true,
      message: "Job updated successfully",
      job
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to update job"
    });
  }
};



// DELETE JOB
exports.deleteJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ error: "Job not found" });

    if (job.employer.toString() !== req.user.id)
      return res.status(403).json({ error: "Not your job" });

    await job.deleteOne();

    res.json({
      success: true,
      message: "Job deleted"
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to delete job"
    });
  }
};



// JOB SEARCH WITH PAGINATION
exports.searchJobs = async (req, res) => {
  try {

    const {
      q,
      location,
      minSalary,
      maxSalary,
      category,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (q) query.title = { $regex: q, $options: "i" };

    if (location)
      query.location = { $regex: location, $options: "i" };

    if (category)
      query.category = category;

    if (minSalary || maxSalary) {
      query.salaryNumber = {};
      if (minSalary)
        query.salaryNumber.$gte = Number(minSalary);

      if (maxSalary)
        query.salaryNumber.$lte = Number(maxSalary);
    }

    let sortOption = { createdAt: -1 };

    if (sort === "salary-high")
      sortOption = { salaryNumber: -1 };

    if (sort === "salary-low")
      sortOption = { salaryNumber: 1 };

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const jobs = await Job.find(query)
      .populate("employer", "verification name")
      .sort(sortOption)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      results: jobs,
    });

  } catch (error) {
    res.status(500).json({
      error: "Job search failed"
    });
  }
};