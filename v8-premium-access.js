function hasPremiumAccess(user) {
  return user.subscription === "premium";
}

module.exports = { hasPremiumAccess };