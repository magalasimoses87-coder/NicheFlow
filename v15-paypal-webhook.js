// NicheFlow V15 PayPal webhook foundation

function processSubscription(event) {
  if (event.status === "ACTIVE") {
    return {
      premium: true,
      status: "active"
    };
  }

  return {
    premium: false,
    status: "inactive"
  };
}

module.exports = { processSubscription };