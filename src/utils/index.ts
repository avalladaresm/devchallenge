export const getMaxValue = (data: any, propertyToEvaluate: string) => {
  if (data.length === 0) return [];
  const result = data.reduce((max: any, obj: any) =>
    max[propertyToEvaluate] > obj[propertyToEvaluate] ? max : obj
  );
  return result;
};
