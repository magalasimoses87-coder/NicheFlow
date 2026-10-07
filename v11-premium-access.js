function canAccessPremium(user) {
  return user.subscription === "premium";
}

function upgradeUser(user) {
  user.subscription = "premium";
  return user;
}

module.exports = {
  canAccessPremium,
  upgradeUser
};