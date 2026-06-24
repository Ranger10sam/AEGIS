"use client";

import * as React from "react";
import Link from "next/link";
import { Pause, Play, RotateCcw } from "lucide-react";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Segmented,
  Switch,
} from "@/components/ui";
import { playChime, playTick, primeAudio } from "@/lib/sound";

const FOCUS_PRESETS = [15, 25, 45, 50];
const BREAK_PRESETS = [5, 10];

type Mode = "focus" | "break";

function format(ms: number): string {
  const sec = Math.ceil(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function FocusTimer({ soundEnabled }: { soundEnabled: boolean }) {
  const [mode, setMode] = React.useState<Mode>("focus");
  const [focusMin, setFocusMin] = React.useState(25);
  const [breakMin, setBreakMin] = React.useState(5);
  const [running, setRunning] = React.useState(false);
  const [tickOn, setTickOn] = React.useState(false);
  const [showLog, setShowLog] = React.useState(false);
  const [loggedMinutes, setLoggedMinutes] = React.useState(25);

  const totalSec = (mode === "focus" ? focusMin : breakMin) * 60;
  const [remainingMs, setRemainingMs] = React.useState(totalSec * 1000);

  const targetRef = React.useRef(0);
  const lastSecRef = React.useRef(-1);
  const doneRef = React.useRef(false);

  const idle = !running && remainingMs === totalSec * 1000;

  const complete = React.useCallback(() => {
    if (soundEnabled) playChime();
    if (mode === "focus") {
      setLoggedMinutes(focusMin);
      setShowLog(true);
    }
  }, [soundEnabled, mode, focusMin]);

  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const left = Math.max(0, targetRef.current - Date.now());
      setRemainingMs(left);
      if (tickOn && soundEnabled) {
        const sec = Math.ceil(left / 1000);
        if (sec !== lastSecRef.current && sec > 0) {
          playTick();
          lastSecRef.current = sec;
        }
      }
      if (left <= 0 && !doneRef.current) {
        doneRef.current = true;
        setRunning(false);
        complete();
        // Re-arm to a fresh full duration so the control returns to a clean
        // "Start" (idle) state instead of a 0:00 "Resume" that re-fires.
        setRemainingMs(totalSec * 1000);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running, tickOn, soundEnabled, complete, totalSec]);

  function setToMode(next: Mode) {
    setMode(next);
    setRunning(false);
    doneRef.current = false;
    setRemainingMs((next === "focus" ? focusMin : breakMin) * 60 * 1000);
  }
  function setPreset(value: number) {
    if (mode === "focus") setFocusMin(value);
    else setBreakMin(value);
    setRemainingMs(value * 60 * 1000);
  }
  function start() {
    primeAudio();
    doneRef.current = false;
    // If somehow expired, start a fresh full session rather than instantly firing.
    const ms = remainingMs > 0 ? remainingMs : totalSec * 1000;
    if (ms !== remainingMs) setRemainingMs(ms);
    targetRef.current = Date.now() + ms;
    setRunning(true);
  }
  function reset() {
    setRunning(false);
    doneRef.current = false;
    setRemainingMs(totalSec * 1000);
  }

  const fraction = totalSec > 0 ? remainingMs / (totalSec * 1000) : 0;
  const R = 130;
  const CIRC = 2 * Math.PI * R;
  const presets = mode === "focus" ? FOCUS_PRESETS : BREAK_PRESETS;
  const current = mode === "focus" ? focusMin : breakMin;

  return (
    <div className="flex flex-col items-center gap-8">
      <Segmented
        ariaLabel="Timer mode"
        variant="contained"
        value={mode}
        onValueChange={(v) => setToMode(v as Mode)}
        disabled={running}
        options={[
          { value: "focus", label: "Focus" },
          { value: "break", label: "Break" },
        ]}
      />

      <div className="relative grid size-60 place-items-center sm:size-72">
        <svg
          viewBox="0 0 300 300"
          className="size-full -rotate-90"
          aria-hidden
        >
          <circle
            cx="150"
            cy="150"
            r={R}
            className="fill-none stroke-line"
            strokeWidth="10"
          />
          <circle
            cx="150"
            cy="150"
            r={R}
            className="fill-none stroke-fg transition-[stroke-dashoffset] duration-300 ease-linear"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - fraction)}
          />
        </svg>
        <div
          className="absolute flex flex-col items-center"
          role="timer"
          aria-live="off"
        >
          <span className="font-mono text-5xl tabular-nums text-fg sm:text-6xl">
            {format(remainingMs)}
          </span>
          <span className="mt-1 text-sm capitalize text-muted">{mode}</span>
        </div>
      </div>

      {idle ? (
        <Segmented
          ariaLabel="Duration preset"
          className="justify-center"
          value={String(current)}
          onValueChange={(v) => setPreset(Number(v))}
          options={presets.map((p) => ({ value: String(p), label: `${p} min` }))}
        />
      ) : null}

      <div className="flex items-center gap-3">
        <Button
          onClick={running ? () => setRunning(false) : start}
          size="lg"
          className="min-w-32"
        >
          {running ? (
            <>
              <Pause aria-hidden /> Pause
            </>
          ) : (
            <>
              <Play aria-hidden /> {idle ? "Start" : "Resume"}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={reset}
          disabled={idle}
          aria-label="Reset timer"
        >
          <RotateCcw aria-hidden />
        </Button>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-muted">
        <Switch checked={tickOn} onCheckedChange={setTickOn} />
        Soft tick each second
      </label>

      <Dialog open={showLog} onOpenChange={setShowLog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nice work</DialogTitle>
            <DialogDescription>
              You focused for {loggedMinutes} minutes. Log this session while
              it&apos;s fresh?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Not now</Button>
            </DialogClose>
            <Button asChild variant="accent">
              <Link href={`/log?minutes=${loggedMinutes}`}>Log session</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
