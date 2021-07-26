export const getMaxValue = (data: any, propertyToEvaluate: string) => {
  if (data.length === 0) return [];
  const result = data.reduce((max: any, obj: any) =>
    max[propertyToEvaluate] > obj[propertyToEvaluate] ? max : obj
  );
  return result;
};

export const formatCurrency = (value: number | undefined) => {
  if (!value) return "Error displaying value";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol"
  });
};
