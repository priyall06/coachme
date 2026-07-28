import { createFileRoute } from "@tanstack/react-router";
import { Plus, ArrowLeft, ArrowRight, Sparkle } from "lucide-react";
import { motion } from "framer-motion";
import robotHero from "@/assets/robot-hero.png";
import robotSide from "@/assets/robot-side.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CoachMe AI ©2026 — The Futurist Coaching Exhibition" },
      {
        name: "description",
        content:
          "An editorial AI coaching experience. Step into the future of personal growth — 14 modules, adaptive intelligence, one coach built for every goal.",
      },
      { property: "og:title", content: "CoachMe AI ©2026 — Futurist Coaching" },
      {
        property: "og:description",
        content:
          "Editorial AI coaching. Adaptive intelligence for academics, career, fitness, sports and personal growth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Outer editorial frame */}
      <div className="mx-auto max-w-[1400px] px-4 pt-4 pb-6 md:px-8 md:pt-6">
        {/* ============ TOP NAV BAR (3 cols) ============ */}
        <div className="grid grid-cols-12 gap-2 md:gap-3">
          {/* menu block */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-12 md:col-span-4 ink-block flex items-center justify-between px-5 py-4"
          >
            <div className="h-3 w-3 rounded-full border border-background/60" />
            <span className="font-mono text-xs tracking-[0.3em]">MENU</span>
            <div className="flex flex-col gap-1">
              <span className="h-px w-6 bg-background" />
              <span className="h-px w-6 bg-background" />
              <span className="h-px w-4 bg-background self-end" />
            </div>
          </motion.div>

          {/* logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="col-span-12 md:col-span-4 panel flex items-center justify-center py-4"
          >
            <span className="font-display text-3xl italic tracking-tight">
              C<span className="not-italic">m</span>
              <sup className="ml-0.5 text-xs">AI</sup>
            </span>
          </motion.div>

          {/* nav */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-12 md:col-span-4 panel flex items-center justify-around px-5 py-4 font-mono text-xs tracking-[0.25em] uppercase"
          >
            <a href="#modules" className="hover:italic">Modules</a>
            <a href="#info" className="hover:italic">Info</a>
            <a href="#collection" className="hover:italic">Collection</a>
          </motion.div>
        </div>

        {/* ============ MAIN GRID ============ */}
        <div className="mt-3 grid grid-cols-12 gap-2 md:gap-3">
          {/* ========== LEFT COLUMN ========== */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-2 md:gap-3">
            {/* intro */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="panel px-6 py-8 md:py-10"
            >
              <p className="text-right font-display text-2xl leading-[1.15] md:text-[28px]">
                The Futurist Coaching<br />
                <span className="italic">Exhibition</span>
                <span className="align-super text-sm not-italic"> ©2026</span>
              </p>
              <p className="mt-8 max-w-[24ch] text-[13px] leading-relaxed text-muted-foreground">
                Discover the intersection of adaptive intelligence and personal
                growth at this cutting-edge coaching experience.
              </p>
            </motion.div>

            {/* stat */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="panel flex items-center gap-4 px-6 py-6"
            >
              <span className="font-display text-5xl leading-none">14+</span>
              <span className="text-[13px] leading-tight text-muted-foreground">
                adaptive modules<br />&amp; live analytics
              </span>
            </motion.div>

            {/* CTA block */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="panel flex-1 flex flex-col justify-between px-6 py-8 min-h-[280px]"
            >
              <div className="flex justify-end">
                <button className="grid h-9 w-9 place-items-center border border-foreground/80 hover:bg-foreground hover:text-background transition">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div>
                <h2 className="font-display text-4xl leading-[1.05] md:text-5xl">
                  Step into<br />
                  the future<br />
                  <span className="italic">of coaching</span>
                </h2>
              </div>
              <div className="flex items-end justify-between">
                <button className="grid h-9 w-9 place-items-center border border-foreground/80 hover:bg-foreground hover:text-background transition">
                  <Plus className="h-4 w-4" />
                </button>
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  BETA · v1.0
                </span>
              </div>
            </motion.div>
          </div>

          {/* ========== CENTER COLUMN (HERO) ========== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 md:col-span-4 panel grain relative overflow-hidden min-h-[600px] md:min-h-[720px]"
          >
            {/* giant background numeral */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
            >
              <span className="font-display text-[26rem] leading-none font-bold text-foreground/95 -translate-y-4 tracking-tighter">
                4
              </span>
            </div>

            {/* robot image */}
            <img
              src={robotHero}
              alt="Futurist AI coach portrait"
              width={1024}
              height={1536}
              className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 h-[92%] w-auto object-contain mix-blend-multiply drop-shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
            />

            {/* top registered mark */}
            <div className="absolute left-6 top-6 font-mono text-[10px] tracking-[0.25em] text-foreground/70">
              ®CM · 2026
            </div>
            <div className="absolute right-6 top-6 font-mono text-[10px] tracking-[0.25em] text-foreground/70">
              N°04
            </div>

            {/* view details circle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute left-8 bottom-24 grid h-28 w-28 place-items-center rounded-full bg-foreground/85 text-background text-xs font-medium tracking-wide backdrop-blur-md"
            >
              View<br />Details
            </motion.button>

            {/* bottom registered */}
            <div className="absolute bottom-6 left-6 grid h-8 w-8 place-items-center rounded-full border border-foreground/80 font-serif text-sm">
              R
            </div>
            <div className="absolute bottom-6 right-6 font-mono text-[10px] tracking-[0.25em] text-foreground/70">
              CM/AI-2026
            </div>
          </motion.div>

          {/* ========== RIGHT COLUMN ========== */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-2 md:gap-3">
            {/* carousel with robot */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="panel relative px-6 py-6 min-h-[340px]"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <button className="grid h-9 w-9 place-items-center rounded-full border border-foreground/80 hover:bg-foreground hover:text-background transition">
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button className="grid h-9 w-9 place-items-center rounded-full border border-foreground/80 hover:bg-foreground hover:text-background transition">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="relative flex justify-center">
                <div className="relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-24 w-24 rounded-full bg-foreground/10" />
                  <img
                    src={robotSide}
                    alt="Neural intelligence sculpture"
                    width={768}
                    height={768}
                    loading="lazy"
                    className="relative h-56 w-auto object-contain mix-blend-multiply"
                  />
                </div>
              </div>
              <p className="mt-4 text-center font-display text-lg italic">
                Explore Adaptive AI Coaching
              </p>
            </motion.div>

            {/* sparkle divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="panel flex items-center justify-center gap-4 px-6 py-4"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="grid h-9 w-9 place-items-center rounded-full border border-foreground/80"
                >
                  <Sparkle className="h-3.5 w-3.5" fill="currentColor" />
                </span>
              ))}
            </motion.div>

            {/* text block */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="panel flex-1 px-6 py-8 min-h-[260px]"
            >
              <h3 className="font-display text-3xl leading-[1.1]">
                Award-Winning<br />
                <span className="italic">Coaching Intelligence</span>
              </h3>
              <p className="mt-6 text-[13px] leading-relaxed text-muted-foreground">
                Our adaptive engine has earned recognition for its clarity and
                vision, offering an unparalleled journey into the next
                generation of personal growth — across academics, career,
                fitness and sports.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                  ↗ START COACHING
                </span>
                <span className="h-px flex-1 mx-4 bg-foreground/30" />
                <Plus className="h-4 w-4" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ============ MARQUEE STRIP ============ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-3 ink-block overflow-hidden py-4"
        >
          <div className="flex animate-marquee whitespace-nowrap font-display text-2xl italic">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex shrink-0 items-center gap-8 px-4">
                {[
                  "Adaptive Intelligence",
                  "Goal Management",
                  "AI Vision",
                  "Habit Streaks",
                  "Weekly Reports",
                  "Conversational Coach",
                  "Progress Analytics",
                  "Opportunity Matching",
                ].map((m) => (
                  <span key={m + k} className="flex items-center gap-8">
                    <span>{m}</span>
                    <Sparkle className="h-3 w-3" fill="currentColor" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ============ MODULES GRID ============ */}
        <section id="modules" className="mt-3 grid grid-cols-12 gap-2 md:gap-3">
          <div className="col-span-12 md:col-span-4 panel px-6 py-8">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              §01 — SYSTEM
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05]">
              Built-in <span className="italic">modules</span> for every
              dimension of growth.
            </h2>
          </div>
          {[
            { n: "01", t: "Adaptive Coaching", d: "AI that learns your style, pace and preferences over time." },
            { n: "02", t: "Goal Management", d: "Break down and prioritize with generated action plans." },
            { n: "03", t: "Daily Planner", d: "Adaptive scheduling that respects your routine." },
            { n: "04", t: "Habit Streaks", d: "Track completion, mood and momentum with analytics." },
            { n: "05", t: "AI Vision", d: "Upload notes or form checks — get instant feedback." },
            { n: "06", t: "Weekly Reports", d: "Charts, scores and coach commentary every Sunday." },
            { n: "07", t: "Conversational Coach", d: "Chat any time — study, career, motivation." },
            { n: "08", t: "Opportunity Matching", d: "Curated courses, scholarships and internships." },
          ].map((m, i) => (
            <motion.div
              key={m.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="col-span-6 md:col-span-2 panel group relative px-5 py-6 min-h-[180px] flex flex-col justify-between hover:bg-foreground hover:text-background transition-colors"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] opacity-70">
                N°{m.n}
              </span>
              <div>
                <h3 className="font-display text-xl leading-tight">{m.t}</h3>
                <p className="mt-2 text-[11px] leading-relaxed opacity-70">{m.d}</p>
              </div>
              <Plus className="h-3.5 w-3.5 self-end" />
            </motion.div>
          ))}
        </section>

        {/* ============ INFO / FOOTER ============ */}
        <section id="info" className="mt-3 grid grid-cols-12 gap-2 md:gap-3">
          <div className="col-span-12 md:col-span-8 ink-block px-8 py-14">
            <p className="font-mono text-[10px] tracking-[0.3em] opacity-60">
              §02 — INVITATION
            </p>
            <h2 className="mt-6 font-display text-5xl leading-[1.02] md:text-6xl">
              Meet your coach.<br />
              <span className="italic">The future is patient.</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button className="rounded-full bg-background px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:bg-background/90 transition">
                Start coaching →
              </button>
              <button className="rounded-full border border-background/60 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] hover:bg-background hover:text-foreground transition">
                Read manifesto
              </button>
            </div>
          </div>
          <div id="collection" className="col-span-12 md:col-span-4 panel flex flex-col justify-between px-6 py-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                §03 — COLLECTION
              </p>
              <p className="mt-6 font-display text-2xl italic leading-tight">
                Every session archived.<br />
                Every insight yours to keep.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between text-[11px] font-mono tracking-[0.2em] text-muted-foreground uppercase">
              <span>© 2026 CoachMe AI</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
