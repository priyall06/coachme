import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";
import { Flame, Plus, Trash2, Loader2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/habits")({
  head: () => ({
    meta: [
      { title: "Habit Tracker — CoachMe AI" },
      { name: "description", content: "Build streaks, log daily check-ins and watch your consistency compound." },
      { property: "og:title", content: "Habit Tracker — CoachMe AI" },
      { property: "og:description", content: "Streaks, mood logging and weekly consistency analytics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HabitsPage,
});

type Habit = { id: string; name: string; description: string | null; target_per_week: number; frequency: string; archived: boolean };
type Log = { id: string; habit_id: string; log_date: string; completed: boolean; mood: number | null };

const day = (offset: number) => new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);

function HabitsPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("7");

  const { data, isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const [h, l] = await Promise.all([
        supabase.from("habits").select("*").eq("archived", false).order("created_at"),
        supabase.from("habit_logs").select("*").gte("log_date", day(29)),
      ]);
      if (h.error) throw h.error;
      return { habits: (h.data ?? []) as Habit[], logs: (l.data ?? []) as Log[] };
    },
  });

  const habits = data?.habits ?? [];
  const logs = data?.logs ?? [];

  const create = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Name your habit");
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("habits").insert({
        user_id: u.user!.id,
        name: name.trim(),
        target_per_week: Number(target) || 7,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Habit added");
      setName("");
      qc.invalidateQueries({ queryKey: ["habits"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not add habit"),
  });

  const toggle = useMutation({
    mutationFn: async ({ habit, date, completed }: { habit: Habit; date: string; completed: boolean }) => {
      const { data: u } = await supabase.auth.getUser();
      const existing = logs.find((l) => l.habit_id === habit.id && l.log_date === date);
      if (existing) {
        const { error } = await supabase.from("habit_logs").update({ completed }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("habit_logs")
          .insert({ user_id: u.user!.id, habit_id: habit.id, log_date: date, completed });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habits"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("Could not log habit"),
  });

  const archive = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("habits").update({ archived: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Habit archived");
      qc.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  function streak(habitId: string) {
    let s = 0;
    for (let i = 0; i < 60; i++) {
      const d = day(i);
      const hit = logs.some((l) => l.habit_id === habitId && l.log_date === d && l.completed);
      if (hit) s++;
      else if (i > 0) break;
    }
    return s;
  }

  const weekly = Array.from({ length: 7 }).map((_, i) => {
    const d = day(6 - i);
    return {
      day: new Date(d).toLocaleDateString(undefined, { weekday: "short" }),
      done: logs.filter((l) => l.log_date === d && l.completed).length,
    };
  });

  const last7 = Array.from({ length: 7 }).map((_, i) => day(6 - i));

  return (
    <AppShell eyebrow="§ MODULE 04" title="Habit Tracker">
      <div className="grid grid-cols-12 gap-2 md:gap-3">
        <div className="panel col-span-12 px-5 py-6 md:col-span-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">NEW HABIT</p>
          <div className="mt-4 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Read 20 pages"
              className="w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
            />
            <input
              type="number"
              min={1}
              max={7}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
              aria-label="Times per week"
            />
            <button
              onClick={() => create.mutate()}
              disabled={create.isPending}
              className="ink-block flex w-full items-center justify-center gap-2 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-60"
            >
              {create.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Add habit
            </button>
          </div>
        </div>

        <div className="panel col-span-12 px-5 py-6 md:col-span-8">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            §01 — CHECK-INS THIS WEEK
          </p>
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--color-chart-4)" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--color-chart-3)" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="var(--color-chart-3)" />
                <Tooltip />
                <Bar dataKey="done" fill="var(--color-chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 space-y-2 md:space-y-3">
          {isLoading && <div className="panel px-5 py-8 text-sm text-muted-foreground">Loading habits…</div>}
          {!isLoading && habits.length === 0 && (
            <div className="panel px-5 py-8 text-sm text-muted-foreground">
              No habits yet — add your first one.
            </div>
          )}
          {habits.map((h) => (
            <div key={h.id} className="panel flex flex-wrap items-center justify-between gap-4 px-5 py-5">
              <div>
                <h3 className="font-display text-2xl leading-tight">{h.name}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  target {h.target_per_week}×/week
                </span>
              </div>
              <div className="flex items-center gap-2">
                {last7.map((d) => {
                  const done = logs.some((l) => l.habit_id === h.id && l.log_date === d && l.completed);
                  return (
                    <button
                      key={d}
                      onClick={() => toggle.mutate({ habit: h, date: d, completed: !done })}
                      aria-label={`Toggle ${h.name} on ${d}`}
                      title={d}
                      className={`h-8 w-8 border text-[10px] ${
                        done ? "ink-block border-foreground" : "border-foreground/50 hover:bg-foreground/10"
                      }`}
                    >
                      {d.slice(8)}
                    </button>
                  );
                })}
                <span className="ml-2 flex items-center gap-1 font-mono text-xs">
                  <Flame className="h-3.5 w-3.5" /> {streak(h.id)}
                </span>
                <button
                  onClick={() => archive.mutate(h.id)}
                  aria-label={`Archive ${h.name}`}
                  className="grid h-8 w-8 place-items-center border border-foreground/70 transition hover:bg-foreground hover:text-background"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
