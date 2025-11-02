import React, { createContext, useContext, useEffect, useState } from "react";

export type MoodKey = "great" | "good" | "okay" | "low" | "difficult" | string;
export type MoodPayload = {
  mood: MoodKey;
  value?: number;         // 1-5 numeric value (optional)
  source?: string;        // e.g. "chat", "manual"
  at?: string;            // ISO date
};

const STORAGE_KEY = "zenora_today_mood";

type MoodContextType = {
  mood: MoodPayload | null;
  setMood: (m: MoodPayload) => void;
  clearMood: () => void;
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMoodState] = useState<MoodPayload | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (mood) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mood));
      // Emit DOM custom event so non-react code can also listen
      window.dispatchEvent(new CustomEvent("zenora:mood-change", { detail: mood }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("zenora:mood-clear"));
    }
  }, [mood]);

  const setMood = (m: MoodPayload) => {
    setMoodState({
      ...m,
      at: m.at ?? new Date().toISOString(),
    });
  };

  const clearMood = () => setMoodState(null);

  return (
    <MoodContext.Provider value={{ mood, setMood, clearMood }}>
      {children}
    </MoodContext.Provider>
  );
};

export function useMood() {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error("useMood must be used within MoodProvider");
  return ctx;
}
