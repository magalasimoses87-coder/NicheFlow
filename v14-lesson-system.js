// NicheFlow V14 Lesson System

const lessons = [];

function addLesson(title, skill, xp) {
  const lesson = {
    id: lessons.length + 1,
    title,
    skill,
    xp
  };

  lessons.push(lesson);
  return lesson;
}

function completeLesson(user, lesson) {
  user.xp += lesson.xp;
  user.level = Math.floor(user.xp / 200) + 1;

  return user;
}

module.exports = {
  lessons,
  addLesson,
  completeLesson
};