import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { generatePlan } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/planner")({
  head: () => ({
    meta: [
      { title: "Planner — CoachMe AI" },
      { name: "description", content: "AI-generated daily schedules that respect your energy, goals and routine." },
      { property: "og:title", content: "Planner — CoachMe AI" },
      { property: "og:description", content: "Adaptive daily scheduling powered by your AI coach." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

type Task = {
  id: string;
  title: string;
  task_date: string;
  start_time: string | null;
  duration_minutes: number;
  priority: string;
  completed: boolean;
  notes: string | null;
};

function PlannerPage() {
  const qc = useQueryClient();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [aiGoal, setAiGoal] = useState("");
  const planFn = useServerFn(generatePlan);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("task_date", date)
        .order("start_time", { nullsFirst: false });
      if (error) throw error;
      return data as Task[];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Task needs a title");
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("tasks").insert({
        user_id: u.user!.id,
        title: title.trim(),
        task_date: date,
        start_time: time || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Task added");
      setTitle("");
      qc.invalidateQueries({ queryKey: ["tasks", date] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not add task"),
  });

  const toggle = useMutation({
    mutationFn: async (t: Task) => {
      const { error } = await supabase.from("tasks").update({ completed: !t.completed }).eq("id", t.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", date] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Task removed");
      qc.invalidateQueries({ queryKey: ["tasks", date] });
    },
  });

  const aiPlan = useMutation({
    mutationFn: async () => {
      if (!aiGoal.trim()) throw new Error("Tell the coach what the day is for");
      const plan = await planFn({ data: { goal: aiGoal.trim(), date } });
      if (!plan.length) throw new Error("The coach couldn't build a plan — try rephrasing");
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("tasks").insert(
        plan.map((p, i) => ({
          user_id: u.user!.id,
          title: p.title,
          task_date: date,
          start_time: /^\d{2}:\d{2}$/.test(p.start_time) ? p.start_time : null,
          duration_minutes: Number(p.duration_minutes) || 30,
          priority: ["low", "medium", "high"].includes(p.priority) ? p.priority : "medium",
          notes: p.notes ?? null,
          position: i,
        })),
      );
      if (error) throw error;
      return plan.length;
    },
    onSuccess: (n) => {
      toast.success(`${n} tasks scheduled`);
      setAiGoal("");
      qc.invalidateQueries({ queryKey: ["tasks", date] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Planning failed"),
  });

  return (
    <AppShell eyebrow="§ MODULE 03" title="Daily Planner">
      <div className="grid grid-cols-12 gap-2 md:gap-3">
        <div className="panel col-span-12 space-y-3 px-5 py-6 md:col-span-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">DAY</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
          />

          <p className="pt-4 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">ADD TASK</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Deep work — thesis chapter 2"
            className="w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
            aria-label="Start time"
          />
          <button
            onClick={() => add.mutate()}
            disabled={add.isPending}
            className="ink-block flex w-full items-center justify-center gap-2 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-60"
          >
            {add.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Add
          </button>

          <p className="pt-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            AI SCHEDULING
          </p>
          <textarea
            value={aiGoal}
            onChange={(e) => setAiGoal(e.target.value)}
            rows={3}
            placeholder="Balance exam revision with gym and part-time work"
            className="w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={() => aiPlan.mutate()}
            disabled={aiPlan.isPending}
            className="flex w-full items-center justify-center gap-2 border border-foreground/70 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] transition hover:bg-foreground hover:text-background disabled:opacity-60"
          >
            {aiPlan.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Generate my day
          </button>
        </div>

        <div className="col-span-12 space-y-2 md:col-span-8 md:space-y-3">
          {isLoading && <div className="panel px-5 py-8 text-sm text-muted-foreground">Loading…</div>}
          {!isLoading && tasks.length === 0 && (
            <div className="panel px-5 py-8 text-sm text-muted-foreground">
              Nothing scheduled for {date}. Add a task or let the coach plan it.
            </div>
          )}
          {tasks.map((t) => (
            <div key={t.id} className="panel flex items-center justify-between gap-4 px-5 py-4">
              <label className="flex flex-1 items-center gap-4">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggle.mutate(t)}
                  className="h-4 w-4 accent-current"
                />
                <div>
                  <p className={`font-display text-xl leading-tight ${t.completed ? "line-through opacity-50" : ""}`}>
                    {t.title}
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {t.start_time?.slice(0, 5) ?? "anytime"} · {t.duration_minutes}m · {t.priority}
                  </span>
                  {t.notes && <p className="mt-1 text-[12px] text-muted-foreground">{t.notes}</p>}
                </div>
              </label>
              <button
                onClick={() => remove.mutate(t.id)}
                aria-label={`Delete ${t.title}`}
                className="grid h-8 w-8 place-items-center border border-foreground/70 transition hover:bg-foreground hover:text-background"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
