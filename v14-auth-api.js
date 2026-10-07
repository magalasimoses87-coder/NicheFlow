// NicheFlow V14 Authentication API Foundation

const sessions = {};

function createUserSession(userId) {
  const token = "session_" + Date.now();

  sessions[token] = {
    userId,
    createdAt: new Date()
  };

  return token;
}

function getSession(token) {
  return sessions[token];
}

module.exports = {
  createUserSession,
  getSession
};