import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { generateReportInsights } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Weekly Reports — CoachMe AI" },
      { name: "description", content: "Charts, scores and coach commentary summarising every week of progress." },
      { property: "og:title", content: "Weekly Reports — CoachMe AI" },
      { property: "og:description", content: "Progress analytics and weekly coach commentary." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

function weekStart(d = new Date()) {
  const x = new Date(d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x.toISOString().slice(0, 10);
}

function ReportsPage() {
  const qc = useQueryClient();
  const insightsFn = useServerFn(generateReportInsights);

  const { data: reports = [] } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reports").select("*").order("week_start", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const build = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user!.id;
      const since = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
      const [goals, logs, tasks] = await Promise.all([
        supabase.from("goals").select("title,progress,status"),
        supabase.from("habit_logs").select("completed,mood,log_date").gte("log_date", since),
        supabase.from("tasks").select("completed,duration_minutes,task_date").gte("task_date", since),
      ]);
      const g = goals.data ?? [];
      const l = logs.data ?? [];
      const t = tasks.data ?? [];
      const habitScore = l.length ? Math.round((l.filter((x) => x.completed).length / l.length) * 100) : 0;
      const goalCompletion = g.length ? Math.round(g.reduce((a, b) => a + b.progress, 0) / g.length) : 0;
      const doneTasks = t.filter((x) => x.completed);
      const focusHours = Math.round((doneTasks.reduce((a, b) => a + (b.duration_minutes || 0), 0) / 60) * 10) / 10;
      const productivity = t.length ? Math.round((doneTasks.length / t.length) * 100) : 0;
      const moods = l.map((x) => x.mood).filter((m): m is number => typeof m === "number");
      const mood = moods.length ? Math.round(moods.reduce((a, b) => a + b, 0) / moods.length) : 0;

      const ai = await insightsFn({
        data: {
          stats: JSON.stringify({ habitScore, goalCompletion, focusHours, productivity, mood, goals: g.slice(0, 10) }),
        },
      });

      const { error } = await supabase.from("reports").upsert(
        {
          user_id: uid,
          week_start: weekStart(),
          habit_score: habitScore,
          goal_completion: goalCompletion,
          focus_hours: focusHours,
          productivity_score: productivity,
          mood_score: mood,
          commentary: ai.commentary,
          recommendations: ai.recommendations ?? [],
        },
        { onConflict: "user_id,week_start" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Weekly report generated");
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not build report"),
  });

  const series = [...reports].reverse().map((r) => ({
    week: r.week_start.slice(5),
    habits: r.habit_score,
    goals: r.goal_completion,
    focus: r.productivity_score,
  }));

  return (
    <AppShell
      eyebrow="§ MODULE 06"
      title="Weekly Reports"
      actions={
        <button
          onClick={() => build.mutate()}
          disabled={build.isPending}
          className="ink-block flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-60"
        >
          {build.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Generate this week
        </button>
      }
    >
      <div className="grid grid-cols-12 gap-2 md:gap-3">
        <div className="panel col-span-12 px-5 py-6">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">§01 — TREND</p>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--color-chart-4)" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="var(--color-chart-3)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--color-chart-3)" />
                <Tooltip />
                <Line type="monotone" dataKey="habits" stroke="var(--color-chart-1)" />
                <Line type="monotone" dataKey="goals" stroke="var(--color-chart-2)" />
                <Line type="monotone" dataKey="focus" stroke="var(--color-chart-3)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {reports.length === 0 && (
          <div className="panel col-span-12 px-5 py-8 text-sm text-muted-foreground">
            No reports yet — generate your first weekly review.
          </div>
        )}
        {reports.map((r) => (
          <div key={r.id} className="panel col-span-12 px-5 py-6 md:col-span-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Week of {r.week_start}
            </span>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {[
                ["Habits", r.habit_score],
                ["Goals", r.goal_completion],
                ["Focus h", r.focus_hours],
                ["Output", r.productivity_score],
              ].map(([k, v]) => (
                <div key={String(k)} className="border border-foreground/25 px-2 py-3">
                  <div className="font-display text-2xl">{String(v)}</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{String(k)}</div>
                </div>
              ))}
            </div>
            {r.commentary && <p className="mt-4 text-[13px] leading-relaxed">{r.commentary}</p>}
            {r.recommendations?.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px]">
                {r.recommendations.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
