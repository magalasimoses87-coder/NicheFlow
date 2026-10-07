// NicheFlow V10 Database Service Foundation

async function saveLessonProgress(db, userId, lessonId) {
  return db.query(
    "INSERT INTO lesson_progress(user_id, lesson_id) VALUES($1,$2)",
    [userId, lessonId]
  );
}

async function getProgress(db, userId) {
  return db.query(
    "SELECT * FROM lesson_progress WHERE user_id=$1",
    [userId]
  );
}

module.exports = {
  saveLessonProgress,
  getProgress
};