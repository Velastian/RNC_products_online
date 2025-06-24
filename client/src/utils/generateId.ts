const generatePredictionId = (index: number): string => {
  const number = index + 1;
  return `PRED-${String(number).padStart(3, "0")}`;
};

export default generatePredictionId;