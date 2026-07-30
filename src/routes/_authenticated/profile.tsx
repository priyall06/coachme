import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — CoachMe AI" },
      { name: "description", content: "Keep your coaching profile and focus areas up to date." },
      { property: "og:title", content: "Profile — CoachMe AI" },
      { property: "og:description", content: "Your identity, headline and focus areas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

const FOCUS = ["Academics", "Career", "Fitness", "Sports", "Habits", "Mindset", "Finance", "Creativity"];

function ProfilePage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [focus, setFocus] = useState<string[]>([]);

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setName(data.full_name ?? "");
      setHeadline(data.headline ?? "");
      setFocus(data.focus_areas ?? []);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: u.user!.id, full_name: name || null, headline: headline || null, focus_areas: focus });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile saved");
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("Could not save profile"),
  });

  return (
    <AppShell eyebrow="§ IDENTITY" title="Profile">
      <div className="panel max-w-2xl space-y-4 px-5 py-6">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Full name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Headline</span>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="mt-1.5 w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
          />
        </label>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Focus areas</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {FOCUS.map((f) => (
              <button
                key={f}
                onClick={() =>
                  setFocus((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]))
                }
                className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] ${
                  focus.includes(f) ? "ink-block border-foreground" : "border-foreground/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="ink-block flex items-center gap-2 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-60"
        >
          {save.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save profile
        </button>
      </div>
    </AppShell>
  );
}
