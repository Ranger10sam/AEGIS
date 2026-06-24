/**
 * Tiny Web Audio synth (CLAUDE.md §10) — no asset files. A soft two-note chime
 * for timer completion, a gentle confirmation blip, and an optional subtle tick.
 * Callers gate on the user's sound_enabled preference; volume is kept modest.
 *
 * Client-only (uses the Web Audio API). The AudioContext is created lazily and
 * must be unlocked by a user gesture — call primeAudio() from a click handler.
 */

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

interface ToneOptions {
  freq: number;
  start: number;
  duration: number;
  peak?: number;
  type?: OscillatorType;
}

function playTone(
  context: AudioContext,
  { freq, start, duration, peak = 0.12, type = "sine" }: ToneOptions,
): void {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  const t0 = context.currentTime + start;
  // Short attack + smooth exponential release to avoid clicks.
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(gain).connect(context.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.03);
}

/** Unlock the audio context from within a user gesture (e.g. pressing Start). */
export function primeAudio(): void {
  getContext();
}

/** Soft rising two-note chime — timer completion. */
export function playChime(): void {
  const c = getContext();
  if (!c) return;
  playTone(c, { freq: 587.33, start: 0, duration: 0.35, peak: 0.12 }); // D5
  playTone(c, { freq: 880.0, start: 0.16, duration: 0.5, peak: 0.11 }); // A5
}

/** Gentle confirmation blip — e.g. a session logged. */
export function playConfirm(): void {
  const c = getContext();
  if (!c) return;
  playTone(c, { freq: 660, start: 0, duration: 0.18, peak: 0.08 });
}

/** Very subtle tick — optional per-second cue while a timer runs. */
export function playTick(): void {
  const c = getContext();
  if (!c) return;
  playTone(c, { freq: 1180, start: 0, duration: 0.025, peak: 0.025, type: "triangle" });
}
