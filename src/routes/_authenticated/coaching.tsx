import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/coaching")({
  head: () => ({
    meta: [
      { title: "Adaptive Coaching — CoachMe AI" },
      { name: "description", content: "See how your coach adapts to your goals, habits and momentum week by week." },
      { property: "og:title", content: "Adaptive Coaching — CoachMe AI" },
      { property: "og:description", content: "The adaptive engine behind your personalised coaching." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoachingPage,
});

function CoachingPage() {
  const { data } = useQuery({
    queryKey: ["coaching-engine"],
    queryFn: async () => {
      const since = new Date(Date.now() - 13 * 864e5).toISOString().slice(0, 10);
      const [goals, logs, tasks, profile] = await Promise.all([
        supabase.from("goals").select("*"),
        supabase.from("habit_logs").select("*").gte("log_date", since),
        supabase.from("tasks").select("*").gte("task_date", since),
        supabase.from("profiles").select("*").maybeSingle(),
      ]);
      return {
        goals: goals.data ?? [],
        logs: logs.data ?? [],
        tasks: tasks.data ?? [],
        profile: profile.data,
      };
    },
  });

  const logs = data?.logs ?? [];
  const tasks = data?.tasks ?? [];
  const goals = data?.goals ?? [];
  const consistency = logs.length ? Math.round((logs.filter((l) => l.completed).length / logs.length) * 100) : 0;
  const execution = tasks.length ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0;
  const avgProgress = goals.length ? Math.round(goals.reduce((a, b) => a + b.progress, 0) / goals.length) : 0;

  const intensity =
    consistency >= 75 && execution >= 75 ? "Push harder" : consistency < 40 ? "Rebuild the base" : "Steady build";

  return (
    <AppShell eyebrow="§ MODULE 01" title="Adaptive Coaching Engine">
      <div className="grid grid-cols-12 gap-2 md:gap-3">
        {[
          ["Habit consistency", `${consistency}%`],
          ["Plan execution", `${execution}%`],
          ["Goal progress", `${avgProgress}%`],
        ].map(([k, v]) => (
          <div key={k} className="panel col-span-12 px-5 py-6 md:col-span-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{k}</span>
            <div className="mt-4 font-display text-5xl">{v}</div>
          </div>
        ))}

        <div className="ink-block col-span-12 px-8 py-10 md:col-span-8">
          <p className="font-mono text-[10px] tracking-[0.3em] opacity-60">CURRENT STRATEGY</p>
          <h2 className="mt-4 font-display text-5xl leading-[1.05]">{intensity}</h2>
          <p className="mt-5 max-w-[60ch] text-[13px] opacity-80">
            {intensity === "Push harder"
              ? "You're executing reliably. The coach will raise task difficulty, add stretch goals and shorten recovery windows."
              : intensity === "Rebuild the base"
                ? "Consistency dipped. The coach will shrink daily load, focus on one keystone habit and rebuild streaks first."
                : "You're on a stable curve. The coach keeps volume steady and reinforces the habits with the strongest streaks."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/chat" className="rounded-full bg-background px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground">
              Talk to coach →
            </Link>
            <Link to="/planner" className="rounded-full border border-background/60 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em]">
              Rebuild my day
            </Link>
          </div>
        </div>

        <div className="panel col-span-12 px-5 py-6 md:col-span-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">FOCUS AREAS</p>
          <ul className="mt-4 space-y-2 text-[13px]">
            {(data?.profile?.focus_areas ?? []).length === 0 && (
              <li className="text-muted-foreground">Set focus areas in your profile.</li>
            )}
            {(data?.profile?.focus_areas ?? []).map((f: string) => (
              <li key={f} className="border-b border-foreground/15 pb-2">{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
