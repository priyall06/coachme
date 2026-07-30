import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — CoachMe AI" },
      { name: "description", content: "Nudges, reminders and coach alerts collected in one feed." },
      { property: "og:title", content: "Notifications — CoachMe AI" },
      { property: "og:description", content: "Your coaching nudges and reminders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markAll = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("All caught up");
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <AppShell
      eyebrow="§ SIGNALS"
      title="Notifications"
      actions={
        <button
          onClick={() => markAll.mutate()}
          className="border border-foreground/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition hover:bg-foreground hover:text-background"
        >
          Mark all read
        </button>
      }
    >
      <div className="space-y-2 md:space-y-3">
        {items.length === 0 && (
          <div className="panel px-5 py-8 text-sm text-muted-foreground">No notifications yet.</div>
        )}
        {items.map((n) => (
          <div key={n.id} className={`panel px-5 py-4 ${n.read ? "opacity-60" : ""}`}>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {n.kind} · {new Date(n.created_at).toLocaleString()}
            </span>
            <h3 className="mt-1 font-display text-xl leading-tight">{n.title}</h3>
            {n.body && <p className="mt-1 text-[13px] text-muted-foreground">{n.body}</p>}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
