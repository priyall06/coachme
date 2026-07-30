import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, useSignOut } from "@/components/AppShell";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CoachMe AI" },
      { name: "description", content: "Tune your coach's tone, reminders and weekly report schedule." },
      { property: "og:title", content: "Settings — CoachMe AI" },
      { property: "og:description", content: "Coaching preferences, reminders and report scheduling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const TONES = ["gentle", "balanced", "direct"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function SettingsPage() {
  const qc = useQueryClient();
  const signOut = useSignOut();
  const [tone, setTone] = useState("balanced");
  const [reminders, setReminders] = useState(true);
  const [emails, setEmails] = useState(true);
  const [day, setDay] = useState(0);

  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_settings").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setTone(data.coach_tone);
      setReminders(data.reminders_enabled);
      setEmails(data.email_updates);
      setDay(data.weekly_report_day);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("user_settings").upsert({
        user_id: u.user!.id,
        coach_tone: tone,
        reminders_enabled: reminders,
        email_updates: emails,
        weekly_report_day: day,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: () => toast.error("Could not save settings"),
  });

  return (
    <AppShell eyebrow="§ SYSTEM" title="Settings">
      <div className="panel max-w-2xl space-y-5 px-5 py-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Coach tone</span>
          <div className="mt-2 flex gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] ${
                  tone === t ? "ink-block border-foreground" : "border-foreground/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={reminders} onChange={(e) => setReminders(e.target.checked)} className="h-4 w-4 accent-current" />
          Daily reminders
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={emails} onChange={(e) => setEmails(e.target.checked)} className="h-4 w-4 accent-current" />
          Email updates
        </label>

        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Weekly report day</span>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="mt-1.5 w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
          >
            {DAYS.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="ink-block flex items-center gap-2 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-60"
          >
            {save.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save settings
          </button>
          <button
            onClick={signOut}
            className="border border-foreground/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] transition hover:bg-foreground hover:text-background"
          >
            Sign out
          </button>
        </div>
      </div>
    </AppShell>
  );
}
