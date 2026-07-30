import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/archive")({
  head: () => ({
    meta: [
      { title: "Archive — CoachMe AI" },
      { name: "description", content: "Every coaching session, vision analysis and weekly report kept in one place." },
      { property: "og:title", content: "Archive — CoachMe AI" },
      { property: "og:description", content: "Browse and download your full coaching history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArchivePage,
});

function ArchivePage() {
  const { data } = useQuery({
    queryKey: ["archive"],
    queryFn: async () => {
      const [sessions, reports, vision] = await Promise.all([
        supabase.from("sessions").select("*").order("created_at", { ascending: false }),
        supabase.from("reports").select("*").order("week_start", { ascending: false }),
        supabase.from("vision_reports").select("*").order("created_at", { ascending: false }),
      ]);
      return {
        sessions: sessions.data ?? [],
        reports: reports.data ?? [],
        vision: vision.data ?? [],
      };
    },
  });

  function download(name: string, payload: unknown) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started");
  }

  return (
    <AppShell
      eyebrow="§ COLLECTION"
      title="Archive"
      actions={
        <button
          onClick={() => download("coachme-archive.json", data ?? {})}
          className="ink-block flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em]"
        >
          <Download className="h-3.5 w-3.5" /> Export all
        </button>
      }
    >
      <div className="grid grid-cols-12 gap-2 md:gap-3">
        {[
          { label: "Coaching sessions", items: data?.sessions ?? [], render: (s: any) => s.title },
          { label: "Weekly reports", items: data?.reports ?? [], render: (r: any) => `Week of ${r.week_start}` },
          { label: "Vision analyses", items: data?.vision ?? [], render: (v: any) => v.title },
        ].map((col) => (
          <div key={col.label} className="panel col-span-12 px-5 py-6 md:col-span-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                {col.label.toUpperCase()}
              </p>
              <button
                onClick={() => download(`${col.label.replace(/\s+/g, "-")}.json`, col.items)}
                aria-label={`Download ${col.label}`}
                className="grid h-7 w-7 place-items-center border border-foreground/70"
              >
                <Download className="h-3 w-3" />
              </button>
            </div>
            <ul className="mt-4 space-y-2 text-[13px]">
              {col.items.length === 0 && <li className="text-muted-foreground">Nothing archived yet.</li>}
              {col.items.map((it: any) => (
                <li key={it.id} className="border-b border-foreground/15 pb-2">
                  {col.render(it)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
