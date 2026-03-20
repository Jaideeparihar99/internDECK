const scoreCompany = (student, company) => {
  let totalScore = 0;
  const breakdown = {
    skillMatch: 0,
    cgpaCheck: 0,
    branchEligibility: 0,
    placementPotential: 0,
  };

  // Skill match = matched skills / required skills * 50
  if (company.requiredSkills && company.requiredSkills.length > 0) {
    const studentSkillsLower = (student.skills || []).map((s) => s.toLowerCase());
    const matchedSkills = company.requiredSkills.filter((skill) =>
      studentSkillsLower.includes(skill.toLowerCase())
    ).length;

    breakdown.skillMatch = Math.round((matchedSkills / company.requiredSkills.length) * 50);
    totalScore += breakdown.skillMatch;
  }

  // CGPA check = 20 points if student CGPA >= company minCgpa
  if (student.cgpa >= (company.minCgpa || 0)) {
    breakdown.cgpaCheck = 20;
    totalScore += 20;
  }

  // Branch eligibility = 20 points if student branch is in company's eligible branches
  if (company.eligibleBranches && company.eligibleBranches.length > 0) {
    if (
      company.eligibleBranches.some(
        (branch) => branch.toLowerCase() === (student.branch || '').toLowerCase()
      )
    ) {
      breakdown.branchEligibility = 20;
      totalScore += 20;
    }
  } else {
    // If no branch restrictions, give full points
    breakdown.branchEligibility = 20;
    totalScore += 20;
  }

  // Placement potential
  if (company.placementPotential === 'High') {
    breakdown.placementPotential = 10;
    totalScore += 10;
  } else if (company.placementPotential === 'Medium') {
    breakdown.placementPotential = 5;
    totalScore += 5;
  } else if (company.placementPotential === 'Low') {
    breakdown.placementPotential = 2;
    totalScore += 2;
  }

  return {
    score: Math.min(totalScore, 100),
    breakdown,
  };
};

const getRecommendations = (student, companies) => {
  // Filter to only open and verified companies
  const openVerifiedCompanies = companies.filter((c) => c.isOpen && c.isVerified);

  // Map each company through scoreCompany
  const scoredCompanies = openVerifiedCompanies
    .map((company) => {
      const { score, breakdown } = scoreCompany(student, company);
      return {
        company,
        score,
        breakdown,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return scoredCompanies;
};

module.exports = {
  scoreCompany,
  getRecommendations,
};
