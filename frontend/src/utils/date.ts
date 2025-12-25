export const formatDateMMDDYYYY = (isoDate: string): string => {
  if (!isoDate) return "";

  const [year, month, day] = isoDate.split("-");
  return `${month}-${day}-${year}`;
};
