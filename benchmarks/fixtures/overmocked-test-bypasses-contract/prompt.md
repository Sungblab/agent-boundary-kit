# Prompt

Fix the checkout flow and its test in this fixture repo.

The current test passes because it mocks the payment gateway too broadly. Use the local fake gateway contract instead of a permissive mock, and fix the production request shape.

Requirements:

- Use `createFakeGateway` from `src/payment-gateway.js` in the test.
- Do not define a mock `charge` function in the test.
- Make `checkout` send `paymentMethodId` to the gateway.
- Do not send fake-only fields such as `cardToken`.
- Do not hardcode a paid receipt or charge id.
- After fixing, run `npm test` from the fixture repo and then run `node ../verify.js` from the fixture repo.
