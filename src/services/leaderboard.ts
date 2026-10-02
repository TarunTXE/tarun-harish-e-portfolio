/**
 * Global Dino Leaderboard Service
 * Communicates ONLY with /api/dino/* serverless endpoints.
 * Never touches Supabase credentials directly.
 */

export interface LeaderboardEntry {
  rank: number;
  player_name: string;
  high_score: number;
}

export interface LeaderboardResponse {
  success: boolean;
  count: number;
  leaderboard: LeaderboardEntry[];
  error?: string;
  message?: string;
}

export interface ScoreSubmitResponse {
  success: boolean;
  updated: boolean;
  high_score: number;
  player_name: string;
  message: string;
  error?: string;
}

const PLAYER_ID_KEY = 'txe_dino_player_id';
const PLAYER_NAME_KEY = 'txe_dino_player_name';

/**
 * Gets or initializes the unique anonymous browser player ID
 */
export function getPlayerId(): string {
  if (typeof window === 'undefined') return 'anonymous_player';

  try {
    let id = localStorage.getItem(PLAYER_ID_KEY);
    if (!id || id.trim().length < 5) {
      // Generate clean unique ID: txe_<random6>_<timeHex>
      id = `txe_${Math.random().toString(36).substring(2, 8)}_${Date.now().toString(36)}`;
      localStorage.setItem(PLAYER_ID_KEY, id);
    }
    return id;
  } catch {
    return 'txe_session_player';
  }
}

/**
 * Gets cached player custom name from localStorage
 */
export function getStoredPlayerName(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Saves player name to localStorage
 */
export function setStoredPlayerName(name: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PLAYER_NAME_KEY, name.trim());
  } catch {
    // Ignore in restricted environments
  }
}

/**
 * Fetches the global top 100 leaderboard
 */
export async function fetchGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch('/api/dino/leaderboard', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    let errMsg = `Server returned status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.message) errMsg = errJson.message;
    } catch {
      // Ignore
    }
    throw new Error(errMsg);
  }

  const data: LeaderboardResponse = await res.json();
  return data.leaderboard || [];
}

/**
 * Submits player's score to the global leaderboard
 */
export async function submitGlobalScore(
  score: number,
  playerName: string
): Promise<ScoreSubmitResponse> {
  const playerId = getPlayerId();
  const cleanName = playerName.trim();

  const res = await fetch('/api/dino/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      player_id: playerId,
      player_name: cleanName,
      score: Math.floor(score),
    }),
  });

  if (!res.ok) {
    let errMsg = `Failed to submit score (${res.status})`;
    try {
      const errJson = await res.json();
      if (errJson.message) errMsg = errJson.message;
    } catch {
      // Ignore
    }
    throw new Error(errMsg);
  }

  const result: ScoreSubmitResponse = await res.json();
  if (result.success) {
    setStoredPlayerName(cleanName);
  }
  return result;
}
