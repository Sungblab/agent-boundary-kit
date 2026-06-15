function renderContractCard(contract) {
  const customer = contract.customerName || "Unknown customer";
  return `Contract ${contract.id}: ${customer} (${contract.planName}) renews ${contract.renewalDate}`;
}

module.exports = { renderContractCard };
