import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — CoachMe AI" },
      { name: "description", content: "Tell your coach what you're working towards so it can adapt to you." },
      { property: "og:title", content: "Onboarding — CoachMe AI" },
      { property: "og:description", content: "Set your focus areas and let CoachMe AI adapt to your goals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const FOCUS = ["Academics", "Career", "Fitness", "Sports", "Habits", "Mindset", "Finance", "Creativity"];
const STYLES = ["Gentle & supportive", "Balanced", "Direct & demanding"];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const [tone, setTone] = useState("Balanced");
  const [hours, setHours] = useState("2");
  const [firstGoal, setFirstGoal] = useState("");
  const [busy, setBusy] = useState(false);

  const steps = ["Identity", "Focus", "Style", "First goal"];

  async function finish() {
    setBusy(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) throw new Error("Not signed in");

      const { error } = await supabase.from("profiles").upsert({
        id: uid,
        full_name: name || null,
        headline: headline || null,
        focus_areas: focus,
        onboarding_completed: true,
        onboarding_answers: { tone, daily_hours: hours, first_goal: firstGoal },
      });
      if (error) throw error;

      if (firstGoal.trim()) {
        await supabase.from("goals").insert({
          user_id: uid,
          title: firstGoal.trim(),
          category: focus[0]?.toLowerCase() ?? "personal",
          priority: "high",
        });
      }
      await supabase.from("notifications").insert({
        user_id: uid,
        title: "Welcome to CoachMe AI",
        body: "Your coach is calibrated. Start with your first goal or open the planner.",
        kind: "success",
      });
      toast.success("You're all set");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save onboarding");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-[900px]">
        <div className="panel px-8 py-10">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {steps.map((s, i) => (
              <span key={s} className={i === step ? "text-foreground underline" : ""}>
                {String(i + 1).padStart(2, "0")} {s}
                {i < steps.length - 1 ? " ·" : ""}
              </span>
            ))}
          </div>

          {step === 0 && (
            <div className="mt-8 space-y-5">
              <h1 className="font-display text-4xl">Who is the coach working with?</h1>
              <Input label="Your name" value={name} onChange={setName} />
              <Input
                label="One line about you"
                value={headline}
                onChange={setHeadline}
                placeholder="Final-year CS student training for a half marathon"
              />
            </div>
          )}

          {step === 1 && (
            <div className="mt-8 space-y-5">
              <h1 className="font-display text-4xl">What should we focus on?</h1>
              <div className="flex flex-wrap gap-2">
                {FOCUS.map((f) => (
                  <button
                    key={f}
                    onClick={() =>
                      setFocus((prev) =>
                        prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
                      )
                    }
                    className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition ${
                      focus.includes(f)
                        ? "ink-block border-foreground"
                        : "border-foreground/60 hover:bg-foreground/10"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 space-y-5">
              <h1 className="font-display text-4xl">How should your coach speak?</h1>
              <div className="grid gap-2 md:grid-cols-3">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTone(s)}
                    className={`border px-4 py-6 text-left font-display text-lg transition ${
                      tone === s ? "ink-block border-foreground" : "border-foreground/60"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Input label="Hours you can invest daily" value={hours} onChange={setHours} type="number" />
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 space-y-5">
              <h1 className="font-display text-4xl">Your first goal</h1>
              <Input
                label="Goal"
                value={firstGoal}
                onChange={setFirstGoal}
                placeholder="Score 90%+ in finals while training 4x a week"
              />
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="border border-foreground/70 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-40"
            >
              Back
            </button>
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="ink-block px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em]"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={busy}
                className="ink-block flex items-center gap-2 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-60"
              >
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Start coaching
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full border border-foreground/70 bg-transparent px-4 py-3 text-sm outline-none focus:bg-foreground/5"
      />
    </label>
  );
}
