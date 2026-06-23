"use client";

// Living reference for the base UI kit (build blocks 1–2). Not in the primary
// nav — reachable at /kit for design QA across themes and breakpoints.

import * as React from "react";
import { Bell, Plus } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Skeleton,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "@/components/ui";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        {children}
      </CardContent>
    </Card>
  );
}

export default function KitPage() {
  const [confidence, setConfidence] = React.useState([3]);
  const [soundOn, setSoundOn] = React.useState(true);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          UI kit reference
        </span>
        <h1 className="font-display text-2xl text-fg sm:text-3xl">
          Base components
        </h1>
        <p className="max-w-xl text-base text-muted">
          The primitives, wired to the design tokens. Dark-first, fully
          responsive, no emojis, motion that respects your preferences.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <Section
          title="Buttons"
          description="One strong neutral primary; gold reserved for the single key action."
        >
          <Button>Primary</Button>
          <Button variant="accent">
            <Plus aria-hidden />
            Log session
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
          <Button size="sm" variant="secondary">
            Small
          </Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="outline" aria-label="Notifications">
            <Bell aria-hidden />
          </Button>
          <Button disabled>Disabled</Button>
        </Section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Form controls</CardTitle>
              <CardDescription>
                Inputs, sliders, and switches at comfortable tap sizes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="kit-email"
                  className="text-sm font-medium text-fg"
                >
                  Email
                </label>
                <Input
                  id="kit-email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="kit-confidence"
                    className="text-sm font-medium text-fg"
                  >
                    Confidence
                  </label>
                  <span className="font-mono text-sm text-muted">
                    {confidence[0]} / 5
                  </span>
                </div>
                <Slider
                  id="kit-confidence"
                  min={0}
                  max={5}
                  step={1}
                  value={confidence}
                  onValueChange={setConfidence}
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="kit-sound"
                  className="text-sm font-medium text-fg"
                >
                  Session sounds
                </label>
                <Switch
                  id="kit-sound"
                  checked={soundOn}
                  onCheckedChange={setSoundOn}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tabs</CardTitle>
              <CardDescription>
                Segmented navigation between related views.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="spring">
                <TabsList>
                  <TabsTrigger value="spring">Spring</TabsTrigger>
                  <TabsTrigger value="dsa">DSA</TabsTrigger>
                  <TabsTrigger value="stories">Stories</TabsTrigger>
                </TabsList>
                <TabsContent value="spring">
                  <p className="text-sm text-muted">
                    22 concepts mapped to TaskFlow, each with a confidence
                    rating.
                  </p>
                </TabsContent>
                <TabsContent value="dsa">
                  <p className="text-sm text-muted">
                    14 patterns, learned deeply before grinding problems.
                  </p>
                </TabsContent>
                <TabsContent value="stories">
                  <p className="text-sm text-muted">
                    STAR stories rehearsed from your own work.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Section
          title="Overlays & feedback"
          description="Dialogs, tooltips, and toasts — quiet, dismissible, accessible."
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>End focus session?</DialogTitle>
                <DialogDescription>
                  You&apos;ve studied for 24 minutes. Log this session before
                  you stop?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Keep going</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="accent">Log session</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover for a tip</Button>
            </TooltipTrigger>
            <TooltipContent>
              Tie every concept back to TaskFlow.
            </TooltipContent>
          </Tooltip>

          <Button
            variant="outline"
            onClick={() =>
              toast({
                title: "Session logged",
                description: "Nice — that's 5 days in a row.",
                variant: "success",
              })
            }
          >
            Show toast
          </Button>
        </Section>

        <Card>
          <CardHeader>
            <CardTitle>Loading state</CardTitle>
            <CardDescription>
              Skeletons reserve space so nothing jumps when data arrives.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </CardContent>
          <CardFooter>
            <span className="text-sm text-muted">
              Every async view ships loading, empty, and error states.
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
