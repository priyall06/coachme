import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Target, TrendingUp, Zap, Eye, MessageSquare, Trophy, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CoachMe AI — Your Personal AI Coach for Every Goal" },
      {
        name: "description",
        content:
          "An adaptive AI coach that learns you, plans your goals, tracks habits, and guides your growth across academics, career, fitness, sports, and personal development.",
      },
      { property: "og:title", content: "CoachMe AI — Your Personal AI Coach" },
      {
        property: "og:description",
        content:
          "Adaptive AI coaching for academics, career, fitness, sports, and personal growth. Plans, habits, reports, and vision analysis — all personalized.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Brain, title: "Adaptive AI Coaching", desc: "Learns your preferences, style, and progress — evolves with you every session." },
  { icon: Target, title: "Smart Goal Planning", desc: "Categorize, prioritize, and break down goals with AI-generated action plans." },
  { icon: Zap, title: "Daily & Weekly Planner", desc: "Adaptive scheduling that respects your routine and shifts with your workload." },
  { icon: Trophy, title: "Habit Streaks", desc: "Build lasting habits with streak tracking, completion analytics, and nudges." },
  { icon: MessageSquare, title: "Conversational Coach", desc: "Chat any time — career advice, study help, workout tips, motivation." },
  { icon: Eye, title: "AI Vision Analysis", desc: "Upload notes, form checks, or screenshots — get instant actionable feedback." },
  { icon: TrendingUp, title: "Progress Analytics", desc: "Charts for mood, study hours, workouts, habits, and weekly performance scores." },
  { icon: Sparkles, title: "Opportunity Matching", desc: "Curated courses, internships, scholarships, and competitions for your profile." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="glass-card mx-4 mt-4 flex items-center justify-between px-6 py-4 md:mx-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground glow-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            CoachMe<span className="text-primary text-glow">.AI</span>
          </span>
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-primary">Features</a>
          <a href="#how" className="transition hover:text-primary">How it works</a>
          <a href="#modules" className="transition hover:text-primary">Modules</a>
        </nav>
        <div className="flex gap-2">
          <button
            disabled
            className="hidden rounded-full border border-glass-border px-4 py-2 text-sm text-muted-foreground opacity-60 md:block"
            title="Coming in Phase 2"
          >
            Sign in
          </button>
          <button
            disabled
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground glow-primary transition hover:scale-105 disabled:opacity-70"
            title="Coming in Phase 2"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 text-center md:pt-32">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="mx-auto max-w-4xl animate-fade-up">
          <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
            Powered by adaptive AI
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Your personal <span className="gradient-text">AI coach</span>
            <br /> for every goal.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            CoachMe AI learns you, plans your days, tracks your habits, and adapts as you grow —
            across academics, career, fitness, sports, and personal development.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              disabled
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground glow-primary transition hover:scale-105 disabled:opacity-70"
            >
              Start coaching free
              <Zap className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <a
              href="#features"
              className="glass-card inline-flex items-center rounded-full px-7 py-3.5 font-semibold text-foreground transition hover:border-primary"
            >
              Explore features
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Phase 1 shipped · Auth & full modules rolling out phase-by-phase
          </p>
        </div>

        {/* Floating preview card */}
        <div className="mx-auto mt-20 max-w-4xl animate-float">
          <div className="glass-card grid gap-6 p-8 md:grid-cols-3">
            {[
              { label: "Goal completion", value: "84%", accent: true },
              { label: "Habit streak", value: "27 days" },
              { label: "Weekly score", value: "9.2 / 10" },
            ].map((s) => (
              <div key={s.label} className="text-left">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
                <div
                  className={`mt-2 font-display text-4xl font-bold ${s.accent ? "text-primary text-glow" : "text-foreground"}`}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            Coaching that <span className="gradient-text">adapts</span> to you
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Every module works together — remembering your progress and refining plans over time.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card group p-6 transition hover:-translate-y-1 hover:border-primary"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground group-hover:glow-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-5xl px-6 py-24">
        <div className="glass-card p-10 md:p-14">
          <h2 className="font-display text-3xl font-bold md:text-4xl">How CoachMe AI works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Onboard", d: "Tell us your goals, learning style, sports, and daily routine. We build an AI profile." },
              { n: "02", t: "Adapt", d: "The engine generates plans for study, workouts, career, and personal growth — refined weekly." },
              { n: "03", t: "Grow", d: "Track habits, chat with your coach, upload images, and get weekly reports." },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-display text-5xl font-bold text-primary/40">{s.n}</div>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-10 text-center font-display text-4xl font-bold md:text-5xl">
          Built-in <span className="gradient-text">modules</span>
        </h2>
        <div className="glass-card flex flex-wrap justify-center gap-3 p-8">
          {[
            "Authentication", "Onboarding", "Dashboard", "Goal Management", "Daily Planner",
            "Weekly Planner", "Habit Tracker", "AI Coaching Engine", "AI Chat", "AI Vision",
            "Progress Analytics", "Weekly Reports", "Recommendations", "Notifications",
          ].map((m) => (
            <span
              key={m}
              className="rounded-full border border-glass-border bg-muted/40 px-4 py-2 text-sm text-foreground transition hover:border-primary hover:text-primary"
            >
              {m}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-sm text-muted-foreground">
        <div className="glass-card px-6 py-6">
          © {new Date().getFullYear()} CoachMe AI · Adaptive coaching, built for every goal.
        </div>
      </footer>
    </div>
  );
}
