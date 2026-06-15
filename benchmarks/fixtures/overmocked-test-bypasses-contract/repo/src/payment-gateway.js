function createFakeGateway() {
  const charges = [];

  return {
    charges,
    async charge(request) {
      if (!Number.isInteger(request.amountCents) || request.amountCents <= 0) {
        throw new Error("amountCents must be a positive integer");
      }

      if (request.currency !== "USD") {
        throw new Error("currency must be USD");
      }

      if (typeof request.paymentMethodId !== "string" || !request.paymentMethodId.startsWith("pm_")) {
        throw new Error("paymentMethodId must be a gateway payment method id");
      }

      charges.push({ ...request });
      return {
        id: `ch_${charges.length}`,
        status: "succeeded",
        amountCents: request.amountCents,
      };
    },
  };
}

module.exports = { createFakeGateway };
