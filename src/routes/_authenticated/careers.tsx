import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";
import { Loader2, Sparkles, Star } from "lucide-react";
import { generateRecommendations } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/careers")({
  head: () => ({
    meta: [
      { title: "Career Matching — CoachMe AI" },
      { name: "description", content: "Curated courses, scholarships, internships and projects matched to your goals." },
      { property: "og:title", content: "Career Matching — CoachMe AI" },
      { property: "og:description", content: "Opportunity matching powered by your coaching profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const qc = useQueryClient();
  const recFn = useServerFn(generateRecommendations);

  const { data: recs = [] } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recommendations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const build = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user!.id;
      const [profile, goals] = await Promise.all([
        supabase.from("profiles").select("full_name,headline,focus_areas").maybeSingle(),
        supabase.from("goals").select("title,category").limit(10),
      ]);
      const items = await recFn({
        data: { profile: JSON.stringify({ profile: profile.data, goals: goals.data ?? [] }) },
      });
      if (!items.length) throw new Error("No matches returned — try again");
      const { error } = await supabase.from("recommendations").insert(
        items.map((i) => ({
          user_id: uid,
          kind: i.kind || "course",
          title: i.title,
          description: i.description,
          provider: i.provider,
          url: i.url,
        })),
      );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("New matches found");
      qc.invalidateQueries({ queryKey: ["recommendations"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Matching failed"),
  });

  const save = useMutation({
    mutationFn: async ({ id, saved }: { id: string; saved: boolean }) => {
      const { error } = await supabase.from("recommendations").update({ saved }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recommendations"] }),
  });

  return (
    <AppShell
      eyebrow="§ MODULE 08"
      title="Opportunity Matching"
      actions={
        <button
          onClick={() => build.mutate()}
          disabled={build.isPending}
          className="ink-block flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-60"
        >
          {build.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Find matches
        </button>
      }
    >
      <div className="grid grid-cols-12 gap-2 md:gap-3">
        {recs.length === 0 && (
          <div className="panel col-span-12 px-5 py-8 text-sm text-muted-foreground">
            No recommendations yet — run a match.
          </div>
        )}
        {recs.map((r) => (
          <div key={r.id} className="panel col-span-12 flex flex-col justify-between px-5 py-5 md:col-span-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {r.kind} {r.provider ? `· ${r.provider}` : ""}
              </span>
              <h3 className="mt-1 font-display text-xl leading-tight">{r.title}</h3>
              <p className="mt-2 text-[13px] text-muted-foreground">{r.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              {r.url ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-[10px] uppercase tracking-[0.25em] underline"
                >
                  Open ↗
                </a>
              ) : (
                <span />
              )}
              <button
                onClick={() => save.mutate({ id: r.id, saved: !r.saved })}
                aria-label="Save recommendation"
                className={`grid h-8 w-8 place-items-center border border-foreground/70 ${r.saved ? "ink-block" : ""}`}
              >
                <Star className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
