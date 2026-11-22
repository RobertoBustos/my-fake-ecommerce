// Maestro matches text as a regular expression, and the expected values have
// characters with a meaning there ("MX$10.00"). Each value is escaped so a flow
// can check it with ${output.expected.<name>} as an exact match.
function escape(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Customer data the checkout flow types in; not secret, so it lives here
var customer = {
  email: "maestro.e2e@example.com",
  name: "Maestro Test",
  phone: "5512345678",
};

// "Contains this exact value": the customer summary is a touchable card, and on iOS
// a touchable merges the texts inside it into a single label
function contains(value) {
  return "[\\s\\S]*" + escape(value) + "[\\s\\S]*";
}

output.customer = customer;
output.contains = {
  customerEmail: contains(customer.email),
  customerName: contains(customer.name),
  customerPhone: contains(customer.phone),
};
output.expected = {
  title: escape(MAESTRO_PRODUCT_TITLE),
  price: escape(MAESTRO_PRODUCT_PRICE),
  quantity: escape(MAESTRO_ORDER_QUANTITY),
  // CartItemCard shows "<quantity> X <unit price>"
  cartPrice: escape(MAESTRO_ORDER_QUANTITY + " X " + MAESTRO_PRODUCT_PRICE),
  subtotal: escape(MAESTRO_EXPECTED_SUBTOTAL),
  taxes: escape(MAESTRO_EXPECTED_TAXES),
  total: escape(MAESTRO_EXPECTED_TOTAL),
  // CardPaymentSummary shows "<BRAND> terminated in <last 4 digits>"
  card: contains("terminated in " + String(MAESTRO_CARD_NUMBER).slice(-4)),
};
