import { kv } from '@vercel/kv';

module.exports = async (req, res) => {
  if (req.headers["x-api-secret"] !== process.env.API_SECRET) 
    return res.status(401).json({ error: "Invalid secret" });

  const bots = await kv.get("bot_list") || [];
  res.json({ usernames: bots });
};
