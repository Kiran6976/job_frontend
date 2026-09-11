// Helper to detect if a job posting's application last date has passed or if it is archived
export const isJobExpired = (job) => {
  if (!job) return false;
  if (job.isArchived === true) return true;
  if (!job.applicationLastDate) return false;

  const str = String(job.applicationLastDate).trim();
  if (
    !str ||
    ["n/a", "none", "tentative", "to be announced", "will be announced soon"].includes(
      str.toLowerCase()
    )
  ) {
    return false;
  }

  // Handle YYYY-MM-DD
  const ymdMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const d = new Date(year, month, day, 23, 59, 59, 999);
    return d.getTime() < Date.now();
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    if (parsed.getHours() === 0 && parsed.getMinutes() === 0 && !str.includes(":")) {
      parsed.setHours(23, 59, 59, 999);
    }
    return parsed.getTime() < Date.now();
  }

  return false;
};

export const formatJobDate = (dateStr, fallback = "—") => {
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
