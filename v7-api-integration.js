// NicheFlow V7 Connected Platform Foundation

const users = {};
const lessons = [];

function createLesson(title, skill, xpReward) {
  const lesson = {
    id: lessons.length + 1,
    title,
    skill,
    xpReward
  };

  lessons.push(lesson);
  return lesson;
}

function completeLesson(userId, lesson) {
  if (!users[userId]) {
    users[userId] = { xp: 0, level: 1, completed: [] };
  }

  users[userId].completed.push(lesson.id);
  users[userId].xp += lesson.xpReward;
  users[userId].level = Math.floor(users[userId].xp / 200) + 1;

  return users[userId];
}

module.exports = {
  createLesson,
  completeLesson,
  users,
  lessons
};