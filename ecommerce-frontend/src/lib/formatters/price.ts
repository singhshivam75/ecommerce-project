export function formatPrice(value: number, currency = "INR") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

export function calculateDiscountPercentage(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
