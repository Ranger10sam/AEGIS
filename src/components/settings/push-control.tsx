"use client";

import * as React from "react";

import { Switch, toast } from "@/components/ui";
import {
  disablePush,
  enablePush,
  isPushEnabled,
  pushSupported,
} from "@/lib/push-client";

export function PushControl({
  vapidPublicKey,
}: {
  vapidPublicKey: string | null;
}) {
  const [enabled, setEnabled] = React.useState(false);
  const [supported, setSupported] = React.useState(true);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setSupported(pushSupported());
    isPushEnabled()
      .then(setEnabled)
      .catch(() => {});
  }, []);

  if (!vapidPublicKey) {
    return (
      <p className="text-sm text-faint">
        Browser notifications need VAPID keys configured on the server.
      </p>
    );
  }
  if (!supported) {
    return (
      <p className="text-sm text-faint">
        Browser notifications aren&apos;t supported in this browser.
      </p>
    );
  }

  async function toggle(next: boolean) {
    setBusy(true);
    try {
      if (next) {
        const ok = await enablePush(vapidPublicKey!);
        if (ok) {
          setEnabled(true);
          toast({ title: "Notifications on", variant: "success" });
        } else {
          toast({
            title: "Permission denied",
            description: "Allow notifications in your browser settings.",
            variant: "warning",
          });
        }
      } else {
        await disablePush();
        setEnabled(false);
        toast({ title: "Notifications off" });
      }
    } catch {
      toast({ title: "Couldn't update notifications", variant: "danger" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor="push-control" className="flex flex-col gap-1">
        <span className="text-sm font-medium text-fg">
          Browser notifications
        </span>
        <span className="text-xs text-faint">
          A daily nudge and timer alerts, even when Aegis is closed.
        </span>
      </label>
      <Switch
        id="push-control"
        checked={enabled}
        disabled={busy}
        onCheckedChange={toggle}
      />
    </div>
  );
}
