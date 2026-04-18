import { kv } from '@vercel/kv';

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST" });
  if (req.headers["x-api-secret"] !== process.env.API_SECRET) 
    return res.status(401).json({ error: "Invalid secret" });

  console.log("[HOP] Bot hopped:", req.body);
  res.json({ success: true });
};
