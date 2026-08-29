export const SESSION_EXPIRY_KEY = "agrismart_session_expires_at";
export const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds (7,200,000 ms)

/**
 * Set or reset the session expiry timestamp in localStorage (defaults to 2 hours from now).
 */
export function setSessionExpiry(
  durationMs: number = SESSION_DURATION_MS,
): number {
  if (typeof window === "undefined") return Date.now() + durationMs;
  const expiresAt = Date.now() + durationMs;
  try {
    localStorage.setItem(SESSION_EXPIRY_KEY, String(expiresAt));
  } catch {
    // Ignore storage quota or disabled storage error
  }
  return expiresAt;
}

/**
 * Read the current session expiry timestamp from localStorage.
 */
export function getSessionExpiry(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (!raw) return null;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Remove session expiry timestamp on logout.
 */
export function clearSessionExpiry(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_EXPIRY_KEY);
  } catch {
    // Ignore storage error
  }
}

/**
 * Check if the current session has exceeded 2 hours.
 */
export function isSessionExpired(): boolean {
  const expiresAt = getSessionExpiry();
  if (!expiresAt) return false;
  return Date.now() >= expiresAt;
}

/**
 * Get the milliseconds remaining before the 2-hour session expires.
 */
export function getRemainingSessionTime(): number | null {
  const expiresAt = getSessionExpiry();
  if (!expiresAt) return null;
  return Math.max(0, expiresAt - Date.now());
}
