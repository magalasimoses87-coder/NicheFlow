// NicheFlow V16 Skill Tree Engine

const skillTree = {
  Knowledge: ["Beginner", "Intermediate", "Advanced", "Master"],
  Discipline: ["Beginner", "Intermediate", "Advanced", "Master"],
  Technology: ["Beginner", "Intermediate", "Advanced", "Master"],
  Money: ["Beginner", "Intermediate", "Advanced", "Master"],
  Communication: ["Beginner", "Intermediate", "Advanced", "Master"],
  Health: ["Beginner", "Intermediate", "Advanced", "Master"]
};

function calculateSkillLevel(xp) {
  if (xp >= 1000) return "Master";
  if (xp >= 500) return "Advanced";
  if (xp >= 250) return "Intermediate";
  return "Beginner";
}

module.exports = {
  skillTree,
  calculateSkillLevel
};