import { getSupabaseAdmin } from '../_lib/supabase.js';
import {
  validatePlayerId,
  validatePlayerName,
  validateScore,
  checkRateLimit,
} from '../_lib/validation.js';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are accepted for this endpoint.',
    });
  }

  // Parse body safely
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const { player_id, player_name, score } = body;

  // Rate Limiting by IP or Player ID (1 submission per 2 seconds max)
  const clientIp =
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.socket?.remoteAddress ||
    player_id ||
    'anonymous';

  if (!checkRateLimit(`submit_${clientIp}`, 2000)) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait a moment before submitting again.',
    });
  }

  // Server-side validation
  const idValidation = validatePlayerId(player_id);
  if (!idValidation.valid) {
    return res.status(400).json({
      error: 'Invalid Input',
      message: idValidation.error,
    });
  }

  const nameValidation = validatePlayerName(player_name);
  if (!nameValidation.valid) {
    return res.status(400).json({
      error: 'Invalid Input',
      message: nameValidation.error,
    });
  }

  const scoreValidation = validateScore(score);
  if (!scoreValidation.valid) {
    return res.status(400).json({
      error: 'Invalid Input',
      message: scoreValidation.error,
    });
  }

  const validPlayerId = idValidation.cleanId;
  const validPlayerName = nameValidation.cleanName;
  const submittedScore = scoreValidation.cleanScore;

  try {
    const supabase = getSupabaseAdmin();
    const nowIso = new Date().toISOString();

    // Check whether player_id already exists in the table
    const { data: existing, error: fetchErr } = await supabase
      .from('dino_leaderboard')
      .select('id, player_id, player_name, high_score')
      .eq('player_id', validPlayerId)
      .maybeSingle();

    if (fetchErr) {
      console.error('[API Check Player Error]:', fetchErr);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to query existing player record.',
      });
    }

    if (existing) {
      // Player already exists in the database
      if (submittedScore > existing.high_score) {
        // HIGHER SCORE: Update high score, name, and updated_at
        const { error: updateErr } = await supabase
          .from('dino_leaderboard')
          .update({
            player_name: validPlayerName,
            high_score: submittedScore,
            updated_at: nowIso,
          })
          .eq('player_id', validPlayerId);

        if (updateErr) {
          console.error('[API Update Score Error]:', updateErr);
          return res.status(500).json({
            error: 'Database Error',
            message: 'Failed to update player high score.',
          });
        }

        return res.status(200).json({
          success: true,
          updated: true,
          high_score: submittedScore,
          player_name: validPlayerName,
          message: 'New personal high score recorded on global leaderboard!',
        });
      } else {
        // LOWER OR EQUAL SCORE: Never reduce existing high score!
        // We only update player_name if changed
        if (validPlayerName !== existing.player_name) {
          await supabase
            .from('dino_leaderboard')
            .update({
              player_name: validPlayerName,
              updated_at: nowIso,
            })
            .eq('player_id', validPlayerId);
        }

        return res.status(200).json({
          success: true,
          updated: false,
          high_score: existing.high_score,
          player_name: validPlayerName,
          message: `Score recorded. Your personal best of ${existing.high_score} remains intact.`,
        });
      }
    } else {
      // New player: Insert record
      const { error: insertErr } = await supabase
        .from('dino_leaderboard')
        .insert({
          player_id: validPlayerId,
          player_name: validPlayerName,
          high_score: submittedScore,
          created_at: nowIso,
          updated_at: nowIso,
        });

      if (insertErr) {
        console.error('[API Insert Player Error]:', insertErr);
        return res.status(500).json({
          error: 'Database Error',
          message: 'Failed to insert new player record into leaderboard.',
        });
      }

      return res.status(201).json({
        success: true,
        updated: true,
        high_score: submittedScore,
        player_name: validPlayerName,
        message: 'Welcome to the global leaderboard! Score saved.',
      });
    }
  } catch (err: any) {
    console.error('[API Score Handler Error]:', err.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'Server configuration or database failure.',
    });
  }
}
