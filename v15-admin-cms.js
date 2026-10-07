// NicheFlow V15 Admin Content Management Foundation

const content = [];

function createLearningPath(title, category) {
  const path = {
    id: content.length + 1,
    title,
    category
  };

  content.push(path);
  return path;
}

module.exports = {
  content,
  createLearningPath
};