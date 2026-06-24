import "server-only";

import webpush from "web-push";

import {
  deletePushSubscriptionById,
  getPushSubscriptions,
} from "@/lib/queries/push";

let ready = false;

function ensureVapid(): boolean {
  if (ready) return true;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const subject = url.startsWith("http") ? url : "https://aegis.app";
  webpush.setVapidDetails(subject, pub, priv);
  ready = true;
  return true;
}

export function isPushConfigured(): boolean {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

/** Send a push to every stored subscription; prune expired ones. */
export async function sendPushToAll(payload: PushPayload): Promise<void> {
  if (!ensureVapid()) return;
  const subs = await getPushSubscriptions();
  const body = JSON.stringify(payload);

  await Promise.allSettled(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          s.subscription as unknown as Parameters<
            typeof webpush.sendNotification
          >[0],
          body,
        );
      } catch (err) {
        const code = (err as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) {
          await deletePushSubscriptionById(s.id);
        }
      }
    }),
  );
}
