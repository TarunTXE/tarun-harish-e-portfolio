/**
 * Basic list of offensive / profane patterns for player callsigns.
 */
const PROFANITY_PATTERNS = [
  /nigg/i,
  /fag/i,
  /fuck/i,
  /shit/i,
  /bitch/i,
  /cunt/i,
  /dick/i,
  /cock/i,
  /pussy/i,
  /asshole/i,
  /bastard/i,
  /whore/i,
  /slut/i,
  /hitler/i,
  /nazi/i,
  /retard/i,
];

// Simple in-memory rate limiting map: key -> timestamp (ms)
const rateLimitMap = new Map<string, number>();

// Clean up stale rate limits every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of rateLimitMap.entries()) {
    if (now - timestamp > 60000) {
      rateLimitMap.delete(key);
    }
  }
}, 300000);

/**
 * Checks if request is rate limited (cooldown: 2000ms per key)
 */
export function checkRateLimit(key: string, cooldownMs = 2000): boolean {
  const now = Date.now();
  const lastTime = rateLimitMap.get(key) || 0;
  if (now - lastTime < cooldownMs) {
    return false; // Rate limited
  }
  rateLimitMap.set(key, now);
  return true; // Allowed
}

/**
 * Validates and sanitizes player callsign (2–16 chars)
 */
export function validatePlayerName(rawName: unknown): {
  valid: boolean;
  cleanName: string;
  error?: string;
} {
  if (typeof rawName !== 'string') {
    return { valid: false, cleanName: '', error: 'Player name must be a string.' };
  }

  const cleanName = rawName.trim().replace(/\s+/g, ' ');

  if (!cleanName) {
    return { valid: false, cleanName: '', error: 'Player name cannot be empty.' };
  }

  if (cleanName.length < 2) {
    return { valid: false, cleanName, error: 'Player name must be at least 2 characters.' };
  }

  if (cleanName.length > 16) {
    return { valid: false, cleanName, error: 'Player name must not exceed 16 characters.' };
  }

  // Only allow alphanumeric characters, spaces, underscores, and hyphens
  const allowedCharsRegex = /^[a-zA-Z0-9_\-\s]+$/;
  if (!allowedCharsRegex.test(cleanName)) {
    return {
      valid: false,
      cleanName,
      error: 'Player name can only contain letters, numbers, spaces, underscores, and hyphens.',
    };
  }

  // Basic profanity check
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(cleanName)) {
      return {
        valid: false,
        cleanName,
        error: 'Please choose an appropriate, non-offensive player name.',
      };
    }
  }

  return { valid: true, cleanName };
}

/**
 * Validates player ID (5 to 64 chars)
 */
export function validatePlayerId(rawId: unknown): {
  valid: boolean;
  cleanId: string;
  error?: string;
} {
  if (typeof rawId !== 'string') {
    return { valid: false, cleanId: '', error: 'Player ID must be a string.' };
  }

  const cleanId = rawId.trim();

  if (cleanId.length < 5 || cleanId.length > 64) {
    return { valid: false, cleanId, error: 'Invalid player ID format.' };
  }

  // Must only contain safe characters
  if (!/^[a-zA-Z0-9_\-]+$/.test(cleanId)) {
    return { valid: false, cleanId, error: 'Invalid characters in player ID.' };
  }

  return { valid: true, cleanId };
}

/**
 * Validates score (integer >= 0 and reasonable upper limit)
 */
export function validateScore(rawScore: unknown): {
  valid: boolean;
  cleanScore: number;
  error?: string;
} {
  const num = typeof rawScore === 'number' ? rawScore : parseInt(String(rawScore), 10);

  if (isNaN(num) || !Number.isInteger(num)) {
    return { valid: false, cleanScore: 0, error: 'Score must be an integer.' };
  }

  if (num < 0) {
    return { valid: false, cleanScore: 0, error: 'Score cannot be negative.' };
  }

  // Realistic upper bound for human Dino play
  if (num > 500000) {
    return { valid: false, cleanScore: 0, error: 'Score exceeds maximum valid range.' };
  }

  return { valid: true, cleanScore: num };
}
