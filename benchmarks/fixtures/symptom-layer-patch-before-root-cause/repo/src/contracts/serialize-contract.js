const planLabels = {
  enterprise: "Enterprise",
};

function serializeContract(record) {
  return {
    id: record.id,
    customer_label: record.customer.profile.legalName,
    planName: planLabels[record.planCode] || record.planCode,
    renewalDate: record.renewalDate,
  };
}

module.exports = { serializeContract };
