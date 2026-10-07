// NicheFlow V16 Production Authentication Layer

const users = [];

function register(email, password) {
  const user = {
    id: users.length + 1,
    email,
    passwordHash: "hashed_" + password,
    createdAt: new Date()
  };

  users.push(user);
  return user;
}

function authenticate(email, password) {
  return users.find(
    user => user.email === email &&
    user.passwordHash === "hashed_" + password
  );
}

module.exports = {
  register,
  authenticate
};