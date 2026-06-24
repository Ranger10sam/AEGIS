import { NextResponse } from "next/server";

import type { Json } from "@/lib/database.types";
import {
  deletePushSubscriptionByEndpoint,
  savePushSubscription,
} from "@/lib/queries/push";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const sub = (await request.json().catch(() => null)) as Json;
  if (!sub) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }
  await savePushSubscription(sub);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { endpoint?: string };
  if (body.endpoint) {
    await deletePushSubscriptionByEndpoint(body.endpoint);
  }
  return NextResponse.json({ ok: true });
}
