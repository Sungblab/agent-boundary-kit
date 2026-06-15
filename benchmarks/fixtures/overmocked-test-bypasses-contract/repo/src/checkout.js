function totalCents(cart) {
  return cart.items.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);
}

async function checkout(cart, paymentMethodId, gateway) {
  const amountCents = totalCents(cart);
  const charge = await gateway.charge({
    amountCents,
    currency: "USD",
    cardToken: paymentMethodId,
  });

  return {
    cartId: cart.id,
    chargeId: charge.id,
    amountCents,
    status: charge.status === "succeeded" ? "paid" : "failed",
  };
}

module.exports = { checkout, totalCents };
