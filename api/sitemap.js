export default async function handler(req, res) {
  const baseUrl = "https://www.theworkflow.online";
  const backendApiUrl = process.env.VITE_API_URL
    ? process.env.VITE_API_URL.replace(/\/+$/, "")
    : "https://job-backend-production-11ab.up.railway.app";

  let jobUrls = "";
  const today = new Date().toISOString().split("T")[0];

  try {
    const response = await fetch(`${backendApiUrl}/api/v1/job/all`);
    const data = await response.json();
    if (data && data.success && Array.isArray(data.jobs)) {
      jobUrls = data.jobs
        .filter((j) => !j.isArchived)
        .map((j) => {
          const id = j._id || j.id;
          const updatedAt = j.updatedAt ? new Date(j.updatedAt).toISOString().split("T")[0] : today;
          return `  <url>
    <loc>${baseUrl}/job/${id}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
        })
        .join("\n");
    }
  } catch (err) {
    console.error("Error generating dynamic sitemap in sitemap.js:", err);
  }

  const staticUrls = `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/jobs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}${jobUrls ? `\n${jobUrls}` : ""}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(xml);
}
