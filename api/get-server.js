import { kv } from '@vercel/kv';

const PLACE_ID = 109983668079237;   // Steal a Brainrot
const COOLDOWN = 15 * 60;           // 15 minuta cooldown (možeš promijeniti)

module.exports = async (req, res) => {
  if (req.headers["x-api-secret"] !== process.env.API_SECRET) 
    return res.status(401).json({ error: "Invalid secret" });

  try {
    const response = await fetch(`https://games.roblox.com/v1/games/${PLACE_ID}/servers/Public?limit=100`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.json({ job_id: null });
    }

    let scanned = await kv.get("scanned_servers") || {};
    const now = Math.floor(Date.now() / 1000);

    for (const server of data.data) {
      const jobId = server.id;
      if (!scanned[jobId] || (now - scanned[jobId]) > COOLDOWN) {
        return res.json({ job_id: jobId });
      }
    }

    res.json({ job_id: null });
  } catch (err) {
    console.error("Error fetching servers:", err);
    res.json({ job_id: null });
  }
};
