/**
 * Recommendation Engine
 * Scores companies for a student based on skills, CGPA, branch, and placement potential.
 */

function scoreCompany(student, company) {
  let score = 0;
  const breakdown = {};

  // Skills match — 50 points
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const requiredSkills = (company.requiredSkills || []).map(s => s.toLowerCase());

  if (requiredSkills.length > 0) {
    const matched = requiredSkills.filter(s => studentSkills.includes(s));
    const skillScore = Math.round((matched.length / requiredSkills.length) * 50);
    score += skillScore;
    breakdown.skills = skillScore;
    breakdown.matchedSkills = matched;
  } else {
    score += 25; // No skill requirement = neutral
    breakdown.skills = 25;
    breakdown.matchedSkills = [];
  }

  // CGPA eligibility — 20 points
  const minCgpa = company.minCgpa || 0;
  if ((student.cgpa || 0) >= minCgpa) {
    const cgpaScore = Math.min(20, Math.round(((student.cgpa - minCgpa) / (10 - minCgpa)) * 10 + 10));
    score += cgpaScore;
    breakdown.cgpa = cgpaScore;
  } else {
    breakdown.cgpa = 0;
  }

  // Branch eligibility — 20 points
  const eligibleBranches = company.eligibleBranches || [];
  if (eligibleBranches.length === 0 || eligibleBranches.includes(student.branch)) {
    score += 20;
    breakdown.branch = 20;
  } else {
    breakdown.branch = 0;
  }

  // Placement potential (stipend > 0 and openings) — 10 points
  if (company.stipend > 0) score += 5;
  if (company.openings > 1) score += 5;
  breakdown.potential = (company.stipend > 0 ? 5 : 0) + (company.openings > 1 ? 5 : 0);

  return { score, breakdown };
}

function getRecommendations(student, companies) {
  const scored = companies
    .map(company => {
      const { score, breakdown } = scoreCompany(student, company);
      return {
        company,
        score,
        breakdown
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return scored;
}

module.exports = { getRecommendations, scoreCompany };
