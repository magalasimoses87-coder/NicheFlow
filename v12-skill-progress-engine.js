// NicheFlow V12 Skill Progress Engine

function updateSkillProgress(skill, xp) {
  const levels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Master"
  ];

  let index = Math.min(
    Math.floor(xp / 250),
    levels.length - 1
  );

  return {
    skill,
    xp,
    level: levels[index]
  };
}

module.exports = { updateSkillProgress };