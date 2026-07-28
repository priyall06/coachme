import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, RadialBar, RadialBarChart, PolarAngleAxis, BarChart, Bar, XAxis } from "recharts";
import { Activity, Flame, Trophy } from "lucide-react";

const growth = Array.from({ length: 14 }, (_, i) => ({
  d: i,
  v: 20 + Math.sin(i / 1.6) * 14 + i * 3.2,
}));

const habits = [
  { d: "M", v: 78 }, { d: "T", v: 92 }, { d: "W", v: 64 },
  { d: "T", v: 88 }, { d: "F", v: 95 }, { d: "S", v: 71 }, { d: "S", v: 84 },
];

const ring = [{ name: "focus", value: 84, fill: "oklch(0.88 0.24 145)" }];

export function AnalyticsPreview() {
  return (
    <div className="grid gap-5 md:grid-cols-6">
      {/* Growth curve */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass-card md:col-span-4 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Growth trajectory</p>
            <p className="mt-1 font-display text-2xl font-semibold">+184% this month</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
            <Activity className="h-3.5 w-3.5" /> live
          </span>
        </div>
        <div className="mt-5 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growth}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.88 0.24 145)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="oklch(0.88 0.24 145)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="oklch(0.88 0.24 145)"
                strokeWidth={2.5}
                fill="url(#g1)"
                isAnimationActive
                animationDuration={1400}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Focus ring */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="glass-card md:col-span-2 p-6 flex flex-col"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Focus score</p>
        <div className="relative flex-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart innerRadius="72%" outerRadius="100%" data={ring} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background={{ fill: "oklch(0.30 0.02 240 / 0.4)" }} dataKey="value" cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold text-primary text-glow">84</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">of 100</span>
          </div>
        </div>
      </motion.div>

      {/* Habit bars */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="glass-card md:col-span-3 p-6"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Weekly habits</p>
          <span className="flex items-center gap-1.5 text-xs text-primary"><Flame className="h-3.5 w-3.5" /> 27-day streak</span>
        </div>
        <div className="mt-5 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={habits} barCategoryGap={10}>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: "oklch(0.68 0.02 240)", fontSize: 11 }} />
              <Bar dataKey="v" radius={[8, 8, 2, 2]} fill="url(#g2)" isAnimationActive animationDuration={1200} />
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.88 0.24 145)" />
                  <stop offset="100%" stopColor="oklch(0.72 0.19 200)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="glass-card md:col-span-3 p-6"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recent wins</p>
          <Trophy className="h-4 w-4 text-primary" />
        </div>
        <ul className="mt-4 space-y-3">
          {[
            { t: "Finished Calculus Ch. 7", s: "Study · +12 XP" },
            { t: "5K run under 24 min", s: "Fitness · new PR" },
            { t: "Applied to 3 internships", s: "Career · milestone" },
          ].map((w, i) => (
            <motion.li
              key={w.t}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-glass-border bg-muted/30 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium">{w.t}</p>
                <p className="text-xs text-muted-foreground">{w.s}</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
