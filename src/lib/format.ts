export function formatMoneyClient(amount: number, currency = "PKR") {
  return `${currency} ${Math.round(amount).toLocaleString("en-PK")}`;
}
