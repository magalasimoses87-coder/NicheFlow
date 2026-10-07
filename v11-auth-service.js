// NicheFlow V11 Authentication Foundation

const users = [];

function register(email, password) {
  const user = {
    id: users.length + 1,
    email,
    password,
    subscription: "free",
    xp: 0,
    level: 1
  };

  users.push(user);
  return user;
}

function login(email, password) {
  return users.find(
    user => user.email === email && user.password === password
  );
}

module.exports = { register, login, users };