export default async function handler(req, res) {
  const { id } = req.query;
  const baseUrl = "https://www.theworkflow.online";

  let job = null;
  const backendApiUrl = process.env.VITE_API_URL
    ? process.env.VITE_API_URL.replace(/\/+$/, "")
    : "https://job-backend-production-11ab.up.railway.app";

  if (id) {
    try {
      const response = await fetch(`${backendApiUrl}/api/v1/job/${id}`);
      const data = await response.json();
      if (data && data.success && data.job) {
        job = data.job;
      }
    } catch (err) {
      console.error("Error fetching job in job-meta:", err);
    }
  }

  const defaultTitle = "The WorkFlow - Job Portal & Career Updates";
  const defaultDesc = "Discover government exams, recruitment notifications, admit cards, exam dates, syllabus, and career opportunities on The WorkFlow.";
  const defaultImage = `${baseUrl}/Logo_New.png`;

  let title = defaultTitle;
  let description = defaultDesc;
  let imageUrl = defaultImage;
  let orgName = "Government Organization";

  if (job) {
    orgName = job.organization || "The WorkFlow";
    title = `${job.title} — ${orgName} | The WorkFlow`;

    description =
      job.postsDescription ||
      job.aboutOrg ||
      (job.slogan ? `"${job.slogan}" — Official Notification` : "") ||
      `Official recruitment notification for ${job.title}. Check eligibility, dates, and apply on The WorkFlow.`;

    if (job.logoUrl) {
      if (job.logoUrl.startsWith("http://") || job.logoUrl.startsWith("https://")) {
        imageUrl = job.logoUrl;
      } else {
        const cleanPath = job.logoUrl.startsWith("/") ? job.logoUrl : `/${job.logoUrl}`;
        imageUrl = `${baseUrl}${cleanPath}`;
      }
    } else {
      const orgLower = String(orgName).toLowerCase();
      if (orgLower.includes("ssc") || orgLower.includes("staff selection")) {
        imageUrl = `${baseUrl}/Staff_Selection_Commission_Logo.jpg`;
      } else if (orgLower.includes("upsc") || orgLower.includes("civil services")) {
        imageUrl = `${baseUrl}/UPSC.png`;
      } else {
        imageUrl = `${baseUrl}/emblem_india.png`;
      }
    }
  }

  const pageUrl = `${baseUrl}/job/${id || ""}`;

  const escapeHtml = (str) => {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(title)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="${escapeHtml(imageUrl)}" />

    <!-- Primary Meta Tags -->
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />

    <!-- Open Graph / WhatsApp / Facebook / LinkedIn -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="The WorkFlow" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:alt" content="${escapeHtml(orgName)} Logo" />
    <meta property="og:image:width" content="600" />
    <meta property="og:image:height" content="600" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(pageUrl)}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />

    <!-- Instant client-side redirect for human visitors -->
    <meta http-equiv="refresh" content="0;url=/job/${id || ''}">
    <script>
      window.location.replace("/job/${id || ''}");
    </script>
  </head>
  <body>
    <div style="font-family: sans-serif; text-align: center; padding: 40px;">
      <h2>Loading opportunity...</h2>
      <p>If you are not redirected automatically, <a href="/job/${id || ''}">click here</a>.</p>
    </div>
  </body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(html);
}
