import { kv } from '@vercel/kv';

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST" });
  if (req.headers["x-api-secret"] !== process.env.API_SECRET) 
    return res.status(401).json({ error: "Invalid secret" });

  let bots = await kv.get("bot_list") || [];
  if (req.body.username && !bots.includes(req.body.username)) {
    bots.push(req.body.username);
    await kv.set("bot_list", bots);
  }
  res.json({ success: true });
};
