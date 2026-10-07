// PayPal subscription foundation

function createSubscription(user) {
  return {
    userId: user.id,
    plan: "premium",
    status: "pending"
  };
}

function activatePremium(subscription) {
  subscription.status = "active";
  return subscription;
}

module.exports = {
  createSubscription,
  activatePremium
};