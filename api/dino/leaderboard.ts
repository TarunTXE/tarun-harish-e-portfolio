import { getSupabaseAdmin } from '../_lib/supabase.js';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only GET requests are accepted for this endpoint.',
    });
  }

  try {
    const supabase = getSupabaseAdmin();

    // Fetch top 100 players ordered by high_score descending
    // Explicitly only selecting player_name and high_score to protect privacy and internal IDs
    const { data, error } = await supabase
      .from('dino_leaderboard')
      .select('player_name, high_score')
      .order('high_score', { ascending: false })
      .limit(100);

    if (error) {
      console.error('[API Leaderboard Error]:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Unable to retrieve leaderboard from database.',
      });
    }

    // Attach numerical rank (1, 2, 3...)
    const leaderboard = (data || []).map((entry, index) => ({
      rank: index + 1,
      player_name: entry.player_name,
      high_score: entry.high_score,
    }));

    // Cache control: cache for 10 seconds, stale-while-revalidate for 30s
    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');

    return res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (err: any) {
    console.error('[API Server Error]:', err.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'Server configuration or connection failure.',
    });
  }
}
