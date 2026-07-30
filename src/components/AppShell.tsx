import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Sparkles,
  Target,
  CalendarDays,
  Flame,
  ScanEye,
  BarChart3,
  MessageSquare,
  Briefcase,
  User,
  Settings,
  Bell,
  Archive,
  LogOut,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const APP_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/coaching", label: "Adaptive Coaching", icon: Sparkles },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/planner", label: "Planner", icon: CalendarDays },
  { to: "/habits", label: "Habits", icon: Flame },
  { to: "/vision", label: "AI Vision", icon: ScanEye },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/chat", label: "AI Coach", icon: MessageSquare },
  { to: "/careers", label: "Career Matching", icon: Briefcase },
  { to: "/archive", label: "Archive", icon: Archive },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };
}

export function AppShell({
  title,
  eyebrow,
  actions,
  children,
}: {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const signOut = useSignOut();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1500px] gap-2 px-3 py-3 md:gap-3 md:px-6 md:py-5">
        {/* sidebar */}
        <aside
          className={`${open ? "fixed inset-0 z-50 block bg-background/95 p-3" : "hidden"} md:static md:block md:w-60 md:shrink-0 md:bg-transparent md:p-0`}
        >
          <div className="panel flex h-full flex-col p-4 md:sticky md:top-5 md:h-[calc(100vh-2.5rem)]">
            <div className="mb-6 flex items-center justify-between">
              <Link to="/" className="font-display text-2xl italic tracking-tight">
                C<span className="not-italic">m</span>
                <sup className="ml-0.5 text-[10px]">AI</sup>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="md:hidden"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-y-auto">
              {APP_NAV.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition ${
                      active
                        ? "ink-block border-foreground"
                        : "border-transparent hover:border-foreground/40"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={signOut}
              className="mt-4 flex items-center gap-3 border border-foreground/70 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition hover:bg-foreground hover:text-background"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </aside>

        {/* main */}
        <main className="min-w-0 flex-1 space-y-2 md:space-y-3">
          <header className="panel flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="grid h-8 w-8 place-items-center border border-foreground/70 md:hidden"
                aria-label="Open navigation"
              >
                <MenuIcon className="h-4 w-4" />
              </button>
              <div>
                {eyebrow ? (
                  <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                    {eyebrow}
                  </p>
                ) : null}
                <h1 className="font-display text-2xl leading-tight md:text-3xl">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">{actions}</div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
