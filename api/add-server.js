import { kv } from '@vercel/kv';

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST" });
  if (req.headers["x-api-secret"] !== process.env.API_SECRET) 
    return res.status(401).json({ error: "Invalid secret" });

  const jobId = req.body.jobId;
  if (jobId) {
    let scanned = await kv.get("scanned_servers") || {};
    scanned[jobId] = Math.floor(Date.now() / 1000);
    await kv.set("scanned_servers", scanned);
  }

  console.log(`[ADD] Primljeni brainroti za server: ${jobId}`);
  res.json({ success: true });
};
