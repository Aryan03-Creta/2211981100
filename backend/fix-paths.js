const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Job = require("./src/models/Job.model");
const User = require("./src/models/UserModel");
const Application = require("./src/models/Application.model");

const fixPath = (filePath) => {
  if (!filePath) return filePath;
  let normalized = filePath.replace(/\\/g, "/");
  if (normalized.includes("uploads/")) {
    return "uploads/" + normalized.split("uploads/")[1];
  }
  return filePath;
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Fix Jobs
    const jobs = await Job.find({});
    let jobsUpdated = 0;
    for (const job of jobs) {
      if (job.companyLogo && job.companyLogo.includes(":\\")) {
        job.companyLogo = fixPath(job.companyLogo);
        await job.save();
        jobsUpdated++;
      }
    }
    console.log(`Updated ${jobsUpdated} Jobs`);

    // Fix Users
    const users = await User.find({});
    let usersUpdated = 0;
    for (const user of users) {
      let updated = false;
      if (user.profile && user.profile.avatar && user.profile.avatar.includes(":\\")) {
        user.profile.avatar = fixPath(user.profile.avatar);
        updated = true;
      }
      if (user.profile && user.profile.resume && user.profile.resume.includes(":\\")) {
        user.profile.resume = fixPath(user.profile.resume);
        updated = true;
      }
      if (updated) {
        await user.save();
        usersUpdated++;
      }
    }
    console.log(`Updated ${usersUpdated} Users`);

    // Fix Applications
    const applications = await Application.find({});
    let appsUpdated = 0;
    for (const app of applications) {
      if (app.resume && app.resume.includes(":\\")) {
        app.resume = fixPath(app.resume);
        await app.save();
        appsUpdated++;
      }
    }
    console.log(`Updated ${appsUpdated} Applications`);

    console.log("All paths fixed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing paths:", error);
    process.exit(1);
  }
};

run();
