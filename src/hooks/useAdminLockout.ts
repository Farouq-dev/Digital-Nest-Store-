import { useCallback, useEffect, useState } from "react";

const LOCK_KEY = "dn-access-lock";
const ATTEMPT_KEY = "dn-access-attempts";
const MAX_ATTEMPTS = 3;

export const LOCKED_MESSAGE = "Access has been disabled on this browser.";
export const INCORRECT_MESSAGE = "Incorrect password.";
export const TOO_MANY_MESSAGE = "Too many failed login attempts.";

function readStore(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStore(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

function removeStore(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
}

/**
 * Tracks failed password attempts and persists both the counter and a
 * permanent browser-level lock flag, so neither a refresh nor reopening the
 * modal resets progress. Never stores or reads the password itself.
 */
export function useAdminLockout() {
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (readStore(LOCK_KEY) === "1") setLocked(true);
    const stored = Number.parseInt(readStore(ATTEMPT_KEY) ?? "", 10);
    if (Number.isFinite(stored) && stored > 0) {
      setAttempts(Math.min(stored, MAX_ATTEMPTS));
      if (stored >= MAX_ATTEMPTS) setLocked(true);
    }
  }, []);

  /** Records a failure and returns the message to display. */
  const registerFailure = useCallback(() => {
    const next = Math.min(attempts + 1, MAX_ATTEMPTS);
    setAttempts(next);
    writeStore(ATTEMPT_KEY, String(next));
    if (next >= MAX_ATTEMPTS) {
      setLocked(true);
      writeStore(LOCK_KEY, "1");
      return TOO_MANY_MESSAGE;
    }
    return INCORRECT_MESSAGE;
  }, [attempts]);

  /** Clears the counter after a successful sign-in (never sets the lock). */
  const reset = useCallback(() => {
    setAttempts(0);
    removeStore(ATTEMPT_KEY);
  }, []);

  return { locked, attempts, registerFailure, reset };
}
