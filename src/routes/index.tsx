import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Target, TrendingUp, Zap, Eye, MessageSquare, Trophy, Sparkles, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import { AnalyticsPreview } from "@/components/AnalyticsPreview";

const Hero3D = lazy(() => import("@/components/Hero3D"));

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
    <div className="min-h-screen overflow-x-hidden">
      {/* Nav */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card mx-4 mt-4 flex items-center justify-between px-6 py-4 md:mx-8"
      >
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
          <a href="#analytics" className="transition hover:text-primary">Analytics</a>
          <a href="#how" className="transition hover:text-primary">How it works</a>
          <a href="#modules" className="transition hover:text-primary">Modules</a>
        </nav>
        <div className="flex gap-2">
          <button disabled className="hidden rounded-full border border-glass-border px-4 py-2 text-sm text-muted-foreground opacity-60 md:block">Sign in</button>
          <button disabled className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground glow-primary transition hover:scale-105 disabled:opacity-70">Get started</button>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-16 pb-24 md:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        {/* grid backdrop */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.88 0.24 145) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.24 145) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
          aria-hidden
        />

        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="font-mono">v1.0 · adaptive intelligence</span>
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
              Your <span className="italic font-serif font-normal text-primary text-glow">personal</span>
              <br /> AI coach for
              <br /> <span className="gradient-text">every goal.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground md:text-xl">
              Learns you. Plans your days. Tracks your habits. Adapts as you grow — across academics, career, fitness, sports & personal development.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                disabled
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground glow-primary disabled:opacity-80"
              >
                Start coaching free
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>
              <a href="#analytics" className="glass-card inline-flex items-center rounded-full px-7 py-3.5 font-semibold text-foreground transition hover:border-primary">
                See it live
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <div><span className="font-display text-2xl font-bold text-foreground">14</span><div>modules</div></div>
              <div className="h-8 w-px bg-glass-border" />
              <div><span className="font-display text-2xl font-bold text-foreground">∞</span><div>possibilities</div></div>
              <div className="h-8 w-px bg-glass-border" />
              <div><span className="font-display text-2xl font-bold text-primary text-glow">1:1</span><div>coaching</div></div>
            </div>
          </motion.div>

          {/* 3D canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[420px] md:h-[520px]"
          >
            <div className="absolute inset-0 rounded-[2rem] glass-card overflow-hidden">
              <ClientOnly fallback={<div className="h-full w-full grid place-items-center text-muted-foreground text-sm">Loading experience…</div>}>
                <Suspense fallback={<div className="h-full w-full grid place-items-center text-muted-foreground text-sm">Rendering 3D…</div>}>
                  <Hero3D />
                </Suspense>
              </ClientOnly>
            </div>
            {/* floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="glass-card absolute -left-4 top-8 px-4 py-3"
            >
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Today</p>
              <p className="font-display text-xl font-bold text-primary text-glow">3 goals ↑</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              className="glass-card absolute -right-2 bottom-10 px-4 py-3"
            >
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Coach says</p>
              <p className="font-serif italic text-base">"You're on fire."</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Analytics */}
      <section id="analytics" className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// live dashboard</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              See your growth <span className="italic font-serif font-normal text-primary">compound</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Real-time analytics for every dimension of your life — with AI-driven insights on top.
          </p>
        </motion.div>
        <AnalyticsPreview />
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// features</p>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Coaching that <span className="italic font-serif font-normal">adapts</span> to <span className="gradient-text">you</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Every module works together — remembering your progress and refining plans over time.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="glass-card group relative overflow-hidden p-6"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/30" />
              <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground group-hover:glow-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-5xl px-6 py-24">
        <div className="glass-card relative overflow-hidden p-10 md:p-14">
          <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-hero)" }} />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// process</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            How CoachMe AI <span className="italic font-serif font-normal">works</span>
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Onboard", d: "Tell us your goals, learning style, sports, and daily routine. We build an AI profile." },
              { n: "02", t: "Adapt", d: "The engine generates plans for study, workouts, career, and growth — refined weekly." },
              { n: "03", t: "Grow", d: "Track habits, chat with your coach, upload images, and get weekly reports." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-serif italic text-6xl font-bold text-primary/50">{s.n}</div>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-10 text-center font-display text-4xl font-bold md:text-5xl">
          Built-in <span className="italic font-serif font-normal text-primary">modules</span>
        </h2>
        <div className="glass-card flex flex-wrap justify-center gap-3 p-8">
          {[
            "Authentication", "Onboarding", "Dashboard", "Goal Management", "Daily Planner",
            "Weekly Planner", "Habit Tracker", "AI Coaching Engine", "AI Chat", "AI Vision",
            "Progress Analytics", "Weekly Reports", "Recommendations", "Notifications",
          ].map((m, i) => (
            <motion.span
              key={m}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.08 }}
              className="rounded-full border border-glass-border bg-muted/40 px-4 py-2 text-sm text-foreground transition hover:border-primary hover:text-primary hover:glow-primary cursor-default"
            >
              {m}
            </motion.span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="glass-card relative overflow-hidden p-12 text-center">
          <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
          <h3 className="font-display text-4xl font-bold md:text-5xl">
            Ready to <span className="italic font-serif font-normal text-primary text-glow">meet</span> your coach?
          </h3>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">Join the beta and let your AI coach take the wheel.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            disabled
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground glow-primary disabled:opacity-80"
          >
            Start coaching free <ArrowUpRight className="h-4 w-4" />
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-sm text-muted-foreground">
        <div className="glass-card px-6 py-6 font-mono">
          © {new Date().getFullYear()} CoachMe.AI · Adaptive coaching, built for every goal.
        </div>
      </footer>
    </div>
  );
}
