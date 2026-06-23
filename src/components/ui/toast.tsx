"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "warning" | "danger";

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  /** Auto-dismiss after ms. Falls back to the provider default (4.5s). */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

// CLAUDE.md §10: subtle, dismissible, never more than 2 stacked.
const TOAST_LIMIT = 2;
const EMPTY: ToastItem[] = [];

let counter = 0;
let toasts: ToastItem[] = EMPTY;
const listeners = new Set<() => void>();

function publish(next: ToastItem[]) {
  toasts = next;
  for (const listener of listeners) listener();
}

/** Queue a toast from anywhere (client-side). Returns its id. */
export function toast(options: ToastOptions): string {
  const id = `toast-${++counter}`;
  publish([...toasts, { id, ...options }].slice(-TOAST_LIMIT));
  return id;
}

export function dismissToast(id: string) {
  publish(toasts.filter((t) => t.id !== id));
}

function useToasts(): ToastItem[] {
  return React.useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => toasts,
    () => EMPTY,
  );
}

// A hairline left stripe signals the toast's intent without shouting.
const variantStripe: Record<ToastVariant, string> = {
  default: "",
  success: "border-l-2 border-l-success",
  warning: "border-l-2 border-l-warning",
  danger: "border-l-2 border-l-danger",
};

/**
 * App-wide toast outlet. Mount once near the root (see layout.tsx); trigger
 * toasts imperatively via `toast({ ... })`.
 */
export function Toaster() {
  const items = useToasts();

  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={4500}>
      {items.map(({ id, title, description, variant = "default", duration }) => (
        <ToastPrimitive.Root
          key={id}
          duration={duration}
          onOpenChange={(open) => {
            if (!open) dismissToast(id);
          }}
          className={cn(
            "pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-md border border-line bg-surface p-4 pr-9 shadow-lg",
            "data-[state=open]:animate-slide-in data-[state=closed]:animate-slide-out",
            "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
            "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform",
            "data-[swipe=end]:animate-slide-out",
            variantStripe[variant],
          )}
        >
          <div className="grid flex-1 gap-1">
            {title && (
              <ToastPrimitive.Title className="text-sm font-medium text-fg">
                {title}
              </ToastPrimitive.Title>
            )}
            {description && (
              <ToastPrimitive.Description className="text-sm text-muted">
                {description}
              </ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close
            aria-label="Dismiss"
            className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-md text-faint transition-colors before:absolute before:-inset-2 before:content-[''] hover:bg-elevated hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong"
          >
            <X className="size-4" aria-hidden />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      {/* Sits above the mobile BottomNav (h-16) + safe area; drops to the corner
          at lg where the bottom bar is hidden. */}
      <ToastPrimitive.Viewport className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-0 z-[100] m-0 flex w-full max-w-[420px] list-none flex-col gap-2 p-4 outline-none lg:bottom-4 lg:right-4" />
    </ToastPrimitive.Provider>
  );
}
