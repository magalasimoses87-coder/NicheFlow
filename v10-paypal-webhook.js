// PayPal webhook foundation

function handleSubscriptionEvent(event) {
  if (event.type === "SUBSCRIPTION.ACTIVATED") {
    return {
      status: "active"
    };
  }

  return {
    status: "pending"
  };
}

module.exports = { handleSubscriptionEvent };