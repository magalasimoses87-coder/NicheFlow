// NicheFlow V8 Production Data Layer Foundation

const db = {
  users: [],
  lessons: [],
  progress: [],
  subscriptions: []
};

function saveProgress(userId, lessonId, xp) {
  db.progress.push({
    userId,
    lessonId,
    xp,
    completedAt: new Date()
  });

  return db.progress;
}

function getUserProgress(userId) {
  return db.progress.filter(item => item.userId === userId);
}

module.exports = {
  db,
  saveProgress,
  getUserProgress
};