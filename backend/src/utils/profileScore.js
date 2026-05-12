exports.calculateScore = (profile, role = "jobseeker") => {
  let score = 0;

  if (role === "jobseeker") {
    if (profile.bio) score += 20;
    if (profile.skills?.length) score += 20;
    if (profile.resume) score += 20;
    if (profile.experience) score += 20;

    // Remaining 20%
    if (profile.location) score += 5;
    if (profile.phone) score += 5;
    if (profile.portfolio || profile.linkedin) score += 5;
    if (profile.projects) score += 5;
  } else {
    // Employer
    if (profile.companyName) score += 15;
    if (profile.companyDescription) score += 15;
    if (profile.location) score += 10;
    if (profile.website) score += 10;
    if (profile.avatar || profile.bio) score += 20;

    // Remaining (30%)
    if (profile.employerName) score += 5;
    if (profile.employerRole) score += 5;
    if (profile.phone) score += 5;
    if (profile.linkedin) score += 5;
    if (profile.projects) score += 10;
  }

  return Math.min(score, 100);
};
