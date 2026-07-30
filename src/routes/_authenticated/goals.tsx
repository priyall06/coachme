import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Check, Pencil } from "lucide-react";

export const Route = createFileRoute("/_authenticated/goals")({
  head: () => ({
    meta: [
      { title: "Goals — CoachMe AI" },
      { name: "description", content: "Create, track, prioritise and complete every goal with your AI coach." },
      { property: "og:title", content: "Goals — CoachMe AI" },
      { property: "og:description", content: "Full goal management with progress tracking and priorities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GoalsPage,
});

type Goal = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  progress: number;
  target_date: string | null;
};

const CATEGORIES = ["academics", "career", "fitness", "sports", "habits", "mindset", "personal"];
const PRIORITIES = ["low", "medium", "high"];

function GoalsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<Goal | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "personal",
    priority: "medium",
    target_date: "",
  });

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Goal[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!form.title.trim()) throw new Error("Give your goal a title");
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user!.id;
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        priority: form.priority,
        target_date: form.target_date || null,
      };
      if (editing) {
        const { error } = await supabase.from("goals").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("goals").insert({ ...payload, user_id: uid });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Goal updated" : "Goal created");
      setEditing(null);
      setForm({ title: "", description: "", category: "personal", priority: "medium", target_date: "" });
      qc.invalidateQueries({ queryKey: ["goals"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save goal"),
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<Goal> }) => {
      const { error } = await supabase.from("goals").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("Update failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Goal deleted");
      qc.invalidateQueries({ queryKey: ["goals"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("Delete failed"),
  });

  const visible = goals.filter((g) => (filter === "all" ? true : g.status === filter));

  return (
    <AppShell eyebrow="§ MODULE 02" title="Goal Management">
      <div className="grid grid-cols-12 gap-2 md:gap-3">
        {/* form */}
        <div className="panel col-span-12 px-5 py-6 md:col-span-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            {editing ? "EDIT GOAL" : "NEW GOAL"}
          </p>
          <div className="mt-4 space-y-3">
            <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Description
              </span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="mt-1.5 w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
              />
            </label>
            <Select
              label="Category"
              value={form.category}
              options={CATEGORIES}
              onChange={(v) => setForm({ ...form, category: v })}
            />
            <Select
              label="Priority"
              value={form.priority}
              options={PRIORITIES}
              onChange={(v) => setForm({ ...form, priority: v })}
            />
            <Field
              label="Target date"
              type="date"
              value={form.target_date}
              onChange={(v) => setForm({ ...form, target_date: v })}
            />
            <div className="flex gap-2">
              <button
                onClick={() => save.mutate()}
                disabled={save.isPending}
                className="ink-block flex flex-1 items-center justify-center gap-2 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-60"
              >
                {save.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                {editing ? "Update" : "Create"}
              </button>
              {editing && (
                <button
                  onClick={() => {
                    setEditing(null);
                    setForm({ title: "", description: "", category: "personal", priority: "medium", target_date: "" });
                  }}
                  className="border border-foreground/70 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em]"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* list */}
        <div className="col-span-12 space-y-2 md:col-span-8 md:space-y-3">
          <div className="panel flex flex-wrap gap-2 px-5 py-4">
            {["all", "active", "paused", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] ${
                  filter === f ? "ink-block border-foreground" : "border-foreground/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {isLoading && <div className="panel px-5 py-8 text-sm text-muted-foreground">Loading goals…</div>}
          {!isLoading && visible.length === 0 && (
            <div className="panel px-5 py-8 text-sm text-muted-foreground">No goals here yet.</div>
          )}

          {visible.map((g) => (
            <div key={g.id} className="panel px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {g.category} · {g.priority} · {g.status}
                    {g.target_date ? ` · due ${g.target_date}` : ""}
                  </span>
                  <h3 className="mt-1 font-display text-2xl leading-tight">{g.title}</h3>
                  {g.description && (
                    <p className="mt-1 max-w-[60ch] text-[13px] text-muted-foreground">{g.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <IconBtn
                    label="Edit goal"
                    onClick={() => {
                      setEditing(g);
                      setForm({
                        title: g.title,
                        description: g.description ?? "",
                        category: g.category,
                        priority: g.priority,
                        target_date: g.target_date ?? "",
                      });
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn
                    label="Complete goal"
                    onClick={() => {
                      patch.mutate({ id: g.id, values: { status: "completed", progress: 100 } });
                      toast.success("Goal completed 🎉");
                    }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn label="Delete goal" onClick={() => remove.mutate(g.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconBtn>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={g.progress}
                  onChange={(e) =>
                    patch.mutate({
                      id: g.id,
                      values: { progress: Number(e.target.value), status: Number(e.target.value) === 100 ? "completed" : "active" },
                    })
                  }
                  className="flex-1 accent-current"
                  aria-label={`Progress for ${g.title}`}
                />
                <span className="font-mono text-xs">{g.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-8 w-8 place-items-center border border-foreground/70 transition hover:bg-foreground hover:text-background"
    >
      {children}
    </button>
  );
}
