import React, { useEffect, useState } from 'react';
import { Trophy, RefreshCw, AlertCircle, X } from 'lucide-react';
import {
  fetchGlobalLeaderboard,
  getStoredPlayerName,
  type LeaderboardEntry,
} from '../services/leaderboard';
import { cyberAudio } from '../utils/audio';

interface DinoLeaderboardPanelProps {
  onClose?: () => void;
  className?: string;
  compact?: boolean;
  refreshTrigger?: number;
  currentCallsign?: string;
  onChangeCallsign?: () => void;
}

export const DinoLeaderboardPanel: React.FC<DinoLeaderboardPanelProps> = ({
  onClose,
  className = '',
  compact = false,
  refreshTrigger,
  currentCallsign,
  onChangeCallsign,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayerName, setCurrentPlayerName] = useState(
    () => currentCallsign || getStoredPlayerName()
  );

  useEffect(() => {
    if (currentCallsign) {
      setCurrentPlayerName(currentCallsign);
    }
  }, [currentCallsign]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGlobalLeaderboard();
      setEntries(data);
    } catch (err: any) {
      console.warn('[Leaderboard Fetch Notice]:', err.message);
      setError(err.message || 'Unable to retrieve leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [refreshTrigger]);

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    cyberAudio.playConfirm();
    loadLeaderboard();
  };

  return (
    <div
      className={`flex flex-col bg-black/90 font-mono text-[var(--foreground)] select-none overflow-hidden ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Leaderboard Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-900/90 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <Trophy size={13} className="text-amber-400" />
          <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
            GLOBAL LEADERBOARD
          </span>
          <span className="text-[10px] text-[var(--muted)]">
            ({entries.length > 0 ? `${entries.length} RUNNERS` : 'TOP 100'})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onChangeCallsign && (
            <button
              onClick={() => {
                cyberAudio.playConfirm();
                onChangeCallsign();
              }}
              className="px-1.5 py-0.5 text-[9px] bg-white/5 hover:bg-emerald-500/20 text-[var(--muted)] hover:text-emerald-400 border border-white/10 hover:border-emerald-500/40 rounded transition-colors cursor-pointer truncate max-w-[120px]"
              title="Change Name"
            >
              {currentPlayerName ? `${currentPlayerName} ✎` : 'SET NAME ✎'}
            </button>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-1 text-[var(--muted)] hover:text-emerald-400 transition-colors cursor-pointer rounded ${
              loading ? 'animate-spin opacity-50' : ''
            }`}
            title="Refresh Leaderboard"
            aria-label="Refresh Leaderboard"
          >
            <RefreshCw size={13} />
          </button>
          {onClose && (
            <button
              onClick={() => {
                cyberAudio.playConfirm();
                onClose();
              }}
              className="p-1 text-[var(--muted)] hover:text-white transition-colors cursor-pointer rounded"
              title="Close Leaderboard"
              aria-label="Close Leaderboard"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 text-xs">
        {loading && (
          <div className="flex flex-col items-center justify-center p-6 space-y-2 text-center text-[var(--muted)]">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] tracking-wider font-semibold">
                QUERYING SATELLITE TELEMETRY...
              </span>
            </div>
            <p className="text-[10px] text-[var(--muted)]">Connecting to global database</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold">
              <AlertCircle size={14} />
              <span>LEADERBOARD OFFLINE</span>
            </div>
            <p className="text-[10px] text-[var(--muted)] max-w-xs">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-[var(--surface-secondary)] border border-[var(--border)] hover:border-emerald-500/50 text-emerald-400 text-[10px] font-bold rounded cursor-pointer transition-colors"
            >
              RETRY CONNECTION
            </button>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
            <Trophy size={20} className="text-[var(--muted)] opacity-40 mb-1" />
            <div className="text-emerald-400 font-bold text-xs tracking-wider">
              NO SCORES YET
            </div>
            <div className="text-[10px] text-[var(--muted)] tracking-wider">
              BE THE FIRST RUNNER TO SUBMIT!
            </div>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-3 py-1.5 text-[10px] font-semibold text-[var(--muted)] border-b border-white/5 sticky top-0 bg-black/95 backdrop-blur-sm z-10">
              <div className="col-span-2 text-left">RANK</div>
              <div className="col-span-6 text-left">PLAYER</div>
              <div className="col-span-4 text-right">HIGH SCORE</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
              {entries.map((entry) => {
                const isTop1 = entry.rank === 1;
                const isTop2 = entry.rank === 2;
                const isTop3 = entry.rank === 3;
                const isCurrentPlayer =
                  currentPlayerName &&
                  entry.player_name.toLowerCase() === currentPlayerName.toLowerCase();

                return (
                  <div
                    key={`${entry.rank}-${entry.player_name}`}
                    className={`grid grid-cols-12 px-3 py-1.5 items-center transition-colors ${
                      isCurrentPlayer
                        ? 'bg-emerald-500/10 border-l-2 border-emerald-500 font-semibold'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-2 flex items-center gap-1 font-bold">
                      {isTop1 && <span className="text-amber-400">01</span>}
                      {isTop2 && <span className="text-slate-300">02</span>}
                      {isTop3 && <span className="text-amber-600">03</span>}
                      {!isTop1 && !isTop2 && !isTop3 && (
                        <span className="text-[var(--muted)]">
                          {entry.rank.toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* Player Name */}
                    <div className="col-span-6 flex items-center gap-1.5 truncate pr-2">
                      <span
                        className={`truncate ${
                          isTop1
                            ? 'text-amber-300 font-bold'
                            : isCurrentPlayer
                            ? 'text-emerald-400 font-bold'
                            : 'text-[var(--foreground)]'
                        }`}
                      >
                        {entry.player_name}
                      </span>
                      {isCurrentPlayer && (
                        <span className="text-[8px] px-1 py-0.2 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/40 shrink-0">
                          YOU
                        </span>
                      )}
                    </div>

                    {/* High Score */}
                    <div className="col-span-4 text-right font-bold tracking-wider">
                      <span
                        className={
                          isTop1
                            ? 'text-amber-400'
                            : isCurrentPlayer
                            ? 'text-emerald-400'
                            : 'text-neutral-300'
                        }
                      >
                        {entry.high_score.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer prompt if not compact */}
      {!compact && (
        <div className="px-3 py-1.5 bg-neutral-900/60 border-t border-[var(--border)] text-[9px] text-[var(--muted)] flex items-center justify-between shrink-0">
          <span>Global real-time rankings</span>
          {onClose && (
            <button
              onClick={() => {
                cyberAudio.playConfirm();
                onClose();
              }}
              className="text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Back to Game</span> &rarr;
            </button>
          )}
        </div>
      )}
    </div>
  );
};
