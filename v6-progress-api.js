// NicheFlow V6 Progress System Foundation

const progress = {
  xp: 720,
  level: 5,
  completedLessons: []
};

function completeLesson(lesson) {
  progress.completedLessons.push(lesson);
  progress.xp += 50;
  updateLevel();
  return progress;
}

function updateLevel() {
  progress.level = Math.floor(progress.xp / 200) + 1;
}

module.exports = { progress, completeLesson };