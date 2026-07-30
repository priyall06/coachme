import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Plus, ArrowUpRight } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CoachMe AI" },
      { name: "description", content: "Your goals, habits, tasks and coaching momentum at a glance." },
      { property: "og:title", content: "Dashboard — CoachMe AI" },
      { property: "og:description", content: "Goals, habits, tasks and momentum in one editorial dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const since = new Date(Date.now() - 13 * 864e5).toISOString().slice(0, 10);
      const [goals, habits, logs, tasks, profile] = await Promise.all([
        supabase.from("goals").select("*").order("created_at", { ascending: false }),
        supabase.from("habits").select("*").eq("archived", false),
        supabase.from("habit_logs").select("*").gte("log_date", since),
        supabase.from("tasks").select("*").eq("task_date", today).order("start_time"),
        supabase.from("profiles").select("*").maybeSingle(),
      ]);
      return {
        goals: goals.data ?? [],
        habits: habits.data ?? [],
        logs: logs.data ?? [],
        tasks: tasks.data ?? [],
        profile: profile.data,
      };
    },
  });
}

function Dashboard() {
  const { data, isLoading } = useDashboard();
  const navigate = useNavigate();

  const goals = data?.goals ?? [];
  const activeGoals = goals.filter((g) => g.status === "active");
  const completed = goals.filter((g) => g.status === "completed");
  const tasks = data?.tasks ?? [];
  const doneTasks = tasks.filter((t) => t.completed).length;

  const series = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() - (13 - i) * 864e5).toISOString().slice(0, 10);
    const count = (data?.logs ?? []).filter((l) => l.log_date === d && l.completed).length;
    return { day: d.slice(5), checkins: count };
  });

  return (
    <AppShell
      eyebrow="§ OVERVIEW"
      title={`Welcome back${data?.profile?.full_name ? `, ${data.profile.full_name.split(" ")[0]}` : ""}`}
      actions={
        <Link
          to="/chat"
          className="ink-block px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em]"
        >
          Ask coach →
        </Link>
      }
    >
      <div className="grid grid-cols-12 gap-2 md:gap-3">
        {[
          { label: "Active goals", value: activeGoals.length, to: "/goals" },
          { label: "Habits tracked", value: data?.habits.length ?? 0, to: "/habits" },
          { label: "Today's tasks", value: `${doneTasks}/${tasks.length}`, to: "/planner" },
          { label: "Goals completed", value: completed.length, to: "/reports" },
        ].map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="panel col-span-6 flex flex-col justify-between px-5 py-6 transition hover:bg-foreground hover:text-background md:col-span-3"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">
              {s.label}
            </span>
            <span className="mt-6 font-display text-4xl">{isLoading ? "—" : s.value}</span>
          </Link>
        ))}

        <div className="panel col-span-12 px-5 py-6 md:col-span-8">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            §01 — MOMENTUM (14 DAYS)
          </p>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--color-chart-4)" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--color-chart-3)" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="var(--color-chart-3)" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="checkins"
                  stroke="var(--color-chart-1)"
                  fill="var(--color-chart-4)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel col-span-12 flex flex-col px-5 py-6 md:col-span-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            §02 — TODAY
          </p>
          <ul className="mt-4 flex-1 space-y-2">
            {tasks.length === 0 && (
              <li className="text-[13px] text-muted-foreground">
                Nothing scheduled. Build a plan in the planner.
              </li>
            )}
            {tasks.slice(0, 6).map((t) => (
              <li key={t.id} className="flex items-center justify-between border-b border-foreground/15 pb-2 text-[13px]">
                <span className={t.completed ? "line-through opacity-50" : ""}>{t.title}</span>
                <span className="font-mono text-[10px] opacity-60">{t.start_time?.slice(0, 5) ?? "—"}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate({ to: "/planner" })}
            className="mt-4 flex items-center justify-between border border-foreground/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition hover:bg-foreground hover:text-background"
          >
            Open planner <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="panel col-span-12 px-5 py-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              §03 — ACTIVE GOALS
            </p>
            <Link to="/goals" className="font-mono text-[10px] uppercase tracking-[0.25em]">
              Manage <ArrowUpRight className="inline h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-12 gap-2 md:gap-3">
            {activeGoals.length === 0 && (
              <p className="col-span-12 text-[13px] text-muted-foreground">
                No active goals yet — create your first one.
              </p>
            )}
            {activeGoals.slice(0, 6).map((g) => (
              <Link
                key={g.id}
                to="/goals"
                className="panel col-span-12 px-4 py-4 transition hover:bg-foreground hover:text-background md:col-span-4"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">
                  {g.category}
                </span>
                <h3 className="mt-2 font-display text-xl leading-tight">{g.title}</h3>
                <div className="mt-3 h-1 w-full bg-foreground/20">
                  <div className="h-1 bg-current" style={{ width: `${g.progress}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
