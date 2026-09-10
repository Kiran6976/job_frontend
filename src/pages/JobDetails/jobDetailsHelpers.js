export const formatDate = (dateStr, fallback = "Tentative") => {
  if (!dateStr) return fallback;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
};

export const isDatePresent = (val) => {
  if (!val) return false;
  const s = String(val).trim().toLowerCase();
  return (
    s !== "" &&
    s !== "null" &&
    s !== "undefined" &&
    s !== "n/a" &&
    s !== "not mentioned" &&
    s !== "none" &&
    s !== "tentative" &&
    s !== "to be announced" &&
    s !== "will be announced soon"
  );
};

export const getWeekday = (dateStr, fallback = "") => {
  if (!dateStr) return fallback;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("en-IN", { weekday: "long" });
  } catch (e) {
    return fallback;
  }
};

export const parseJobDate = (dateVal) => {
  if (!dateVal || !isDatePresent(dateVal)) return null;
  const str = String(dateVal).trim();

  // If YYYY-MM-DD
  const ymdMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    return new Date(year, month, day, 23, 59, 59, 999);
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    if (parsed.getHours() === 0 && parsed.getMinutes() === 0 && !str.includes(":")) {
      parsed.setHours(23, 59, 59, 999);
    }
    return parsed;
  }

  return null;
};
