export const formatCurrency = (amount, currency = "BDT") => {
  const numericAmount = Number(amount || 0);

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};
