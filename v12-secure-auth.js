// NicheFlow V12 Secure Authentication Foundation

const crypto = require("crypto");

function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

function createSession(user) {
  return {
    userId: user.id,
    createdAt: new Date()
  };
}

module.exports = {
  hashPassword,
  createSession
};