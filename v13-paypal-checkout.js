// NicheFlow V13 PayPal Subscription Foundation

function createPremiumPlan(userId) {
  return {
    userId,
    plan: "premium",
    status: "pending"
  };
}

function activateSubscription(subscription) {
  subscription.status = "active";
  return subscription;
}

module.exports = {
  createPremiumPlan,
  activateSubscription
};