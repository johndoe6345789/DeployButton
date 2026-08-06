import { api } from "@/api/client";

export const POLL_INTERVAL_MS = 1500;

export interface FetchState {
  cancelled: boolean;
  isLive: () => boolean;
  startOffsetRef: { current: number };
  endOffsetRef: { current: number };
  setTimer: (id: ReturnType<typeof setTimeout>) => void;
  pushFragment: (text: string, prepend: boolean) => void;
  setHasEarlier: (v: boolean) => void;
  setError: (v: string) => void;
}

// Fetches one chunk of a step's output and, while still live, schedules the
// next poll -- the actual tail/live-tail logic behind useStepOutputPolling,
// pulled into a plain function so that hook's effect body stays short.
export async function fetchAndSchedule(
  stepRunId: number,
  isInitial: boolean,
  s: FetchState,
) {
  try {
    const params = isInitial ? {} : { after: s.endOffsetRef.current };
    const chunk = await api.getStepOutput(stepRunId, params);
    if (s.cancelled) return;
    if (isInitial) {
      s.startOffsetRef.current = chunk.start_offset;
      s.setHasEarlier(chunk.start_offset > 0);
    }
    s.endOffsetRef.current = chunk.end_offset;
    s.pushFragment(chunk.text, false);
    if (s.isLive()) {
      const next = () => fetchAndSchedule(stepRunId, false, s);
      s.setTimer(setTimeout(next, POLL_INTERVAL_MS));
    }
  } catch (e) {
    if (!s.cancelled) {
      s.setError(e instanceof Error ? e.message : "Failed to load output");
    }
  }
}
