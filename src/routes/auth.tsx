import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — CoachMe AI" },
      { name: "description", content: "Sign in or create your CoachMe AI account to start adaptive coaching." },
      { property: "og:title", content: "Sign in — CoachMe AI" },
      { property: "og:description", content: "Create your account and meet your adaptive AI coach." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "forgot" | "reset";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setMode("reset");
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && !window.location.hash.includes("type=recovery")) {
        navigate({ to: "/dashboard", replace: true });
      }
    });
  }, [navigate]);

  async function afterAuth() {
    const { data } = await supabase.from("profiles").select("onboarding_completed").maybeSingle();
    navigate({ to: data?.onboarding_completed ? "/dashboard" : "/onboarding", replace: true });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        await afterAuth();
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created");
        await afterAuth();
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Reset link sent — check your inbox");
        setMode("login");
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast.success("Password updated");
        await afterAuth();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    try {
      const res = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (res.error) throw res.error;
      if (!("redirected" in res && res.redirected)) await afterAuth();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  const copy = {
    login: { title: "Sign in", cta: "Enter" },
    signup: { title: "Create account", cta: "Begin" },
    forgot: { title: "Reset password", cta: "Send link" },
    reset: { title: "New password", cta: "Update" },
  }[mode];

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto grid max-w-[1100px] grid-cols-12 gap-2 md:gap-3">
        <div className="ink-block col-span-12 flex flex-col justify-between px-8 py-12 md:col-span-6">
          <Link to="/" className="font-display text-3xl italic">
            C<span className="not-italic">m</span>
            <sup className="ml-0.5 text-xs">AI</sup>
          </Link>
          <h2 className="mt-16 font-display text-5xl leading-[1.02]">
            Meet your coach.
            <br />
            <span className="italic">The future is patient.</span>
          </h2>
          <p className="mt-8 max-w-[36ch] text-[13px] opacity-70">
            Fourteen adaptive modules — goals, habits, planning, vision analysis, weekly reports and
            a coach that remembers every conversation.
          </p>
        </div>

        <div className="panel col-span-12 px-8 py-12 md:col-span-6">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            § ACCESS
          </p>
          <h1 className="mt-3 font-display text-4xl">{copy.title}</h1>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <Field label="Full name" value={name} onChange={setName} required />
            )}
            {mode !== "reset" && (
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
            )}
            {(mode === "login" || mode === "signup" || mode === "reset") && (
              <Field
                label={mode === "reset" ? "New password" : "Password"}
                type="password"
                value={password}
                onChange={setPassword}
                required
                minLength={6}
              />
            )}
            <button
              type="submit"
              disabled={busy}
              className="ink-block flex w-full items-center justify-center gap-2 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.25em] disabled:opacity-60"
            >
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {copy.cta}
            </button>
          </form>

          {mode !== "reset" && (
            <>
              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-foreground/25" />
                <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">OR</span>
                <span className="h-px flex-1 bg-foreground/25" />
              </div>
              <button
                onClick={google}
                disabled={busy}
                className="w-full border border-foreground/70 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.25em] transition hover:bg-foreground hover:text-background disabled:opacity-60"
              >
                Continue with Google
              </button>
            </>
          )}

          <div className="mt-8 space-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {mode === "login" && (
              <>
                <button onClick={() => setMode("signup")} className="block hover:text-foreground">
                  → Create an account
                </button>
                <button onClick={() => setMode("forgot")} className="block hover:text-foreground">
                  → Forgot password
                </button>
              </>
            )}
            {mode !== "login" && (
              <button onClick={() => setMode("login")} className="block hover:text-foreground">
                → Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full border border-foreground/70 bg-transparent px-4 py-3 text-sm outline-none focus:bg-foreground/5"
      />
    </label>
  );
}
