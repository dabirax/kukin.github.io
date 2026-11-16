export const formatNaira = (value) => {
  const amount = Number(value) || 0;
  return `₦${amount.toLocaleString("en-NG")}`;
};

export const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatCount = (value) => {
  const count = Number(value) || 0;

  if (count < 1000) return String(count);
  if (count < 1000000) {
    return `${(count / 1000).toFixed(count < 10000 ? 1 : 0)}k`;
  }

  return `${(count / 1000000).toFixed(1)}m`;
};
