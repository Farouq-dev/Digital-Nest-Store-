import { useCallback, useEffect, useState } from "react";

const LOCK_KEY = "dn-access-lock";
const MAX_ATTEMPTS = 3;

export const LOCKED_MESSAGE = "Access has been disabled on this browser.";
export const INCORRECT_MESSAGE = "Incorrect password.";
export const TOO_MANY_MESSAGE = "Too many failed login attempts.";

/**
 * Tracks failed password attempts in memory and persists a permanent
 * browser-level lock flag after the third failure.
 */
export function useAdminLockout() {
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(LOCK_KEY) === "1") setLocked(true);
    } catch {
      /* storage unavailable */
    }
  }, []);

  /** Records a failure and returns the message to display. */
  const registerFailure = useCallback(() => {
    const next = attempts + 1;
    setAttempts(next);
    if (next >= MAX_ATTEMPTS) {
      setLocked(true);
      try {
        localStorage.setItem(LOCK_KEY, "1");
      } catch {
        /* storage unavailable */
      }
      return TOO_MANY_MESSAGE;
    }
    return INCORRECT_MESSAGE;
  }, [attempts]);

  const reset = useCallback(() => setAttempts(0), []);

  return { locked, attempts, registerFailure, reset };
}
