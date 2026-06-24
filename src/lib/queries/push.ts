import "server-only";

import type { Json, PushSubscription as PushRow } from "@/lib/database.types";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveUserKey } from "@/lib/user";

export async function getPushSubscriptions(): Promise<PushRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("push_subscriptions")
    .select("*")
    .eq("user_key", getActiveUserKey());
  if (error) throw new Error(`Failed to load push subs: ${error.message}`);
  return (data as PushRow[] | null) ?? [];
}

function endpointOf(subscription: Json): string | null {
  if (subscription && typeof subscription === "object" && !Array.isArray(subscription)) {
    const ep = (subscription as Record<string, unknown>).endpoint;
    return typeof ep === "string" ? ep : null;
  }
  return null;
}

export async function savePushSubscription(subscription: Json): Promise<void> {
  const userKey = getActiveUserKey();
  const endpoint = endpointOf(subscription);
  // Replace any existing row for the same endpoint (re-subscribe is idempotent).
  if (endpoint) {
    await supabaseAdmin()
      .from("push_subscriptions")
      .delete()
      .eq("user_key", userKey)
      .eq("subscription->>endpoint", endpoint);
  }
  const { error } = await supabaseAdmin()
    .from("push_subscriptions")
    .insert({ user_key: userKey, subscription });
  if (error) throw new Error(`Failed to save push sub: ${error.message}`);
}

export async function deletePushSubscriptionByEndpoint(
  endpoint: string,
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("push_subscriptions")
    .delete()
    .eq("user_key", getActiveUserKey())
    .eq("subscription->>endpoint", endpoint);
  if (error) throw new Error(`Failed to delete push sub: ${error.message}`);
}

export async function deletePushSubscriptionById(id: string): Promise<void> {
  await supabaseAdmin().from("push_subscriptions").delete().eq("id", id);
}
