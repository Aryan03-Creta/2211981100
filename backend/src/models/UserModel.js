const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["jobseeker", "employer", "admin"],
      default: "jobseeker",
    },

    profile: {
      skills: [String],
      bio: String,
      resume: String,
      experience: String,

      avatar: String, // new field for profile image

      // new fields for jobseeker
      phone: String,
      portfolio: String,
      linkedin: String,
      projects: String,

      // fields for employer
      employerName: String,
      employerRole: String,

      companyName: String,
      companyDescription: String,
      location: String,
      website: String,


     
    },
    verification: {
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    requestedAt: Date,
    verifiedAt: Date,
    rejectedAt: Date,
    rejectionReason: String
}
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
