import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { coachChat } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "AI Coach Chat — CoachMe AI" },
      { name: "description", content: "Talk to your adaptive AI coach any time about study, career, fitness or motivation." },
      { property: "og:title", content: "AI Coach Chat — CoachMe AI" },
      { property: "og:description", content: "A conversational coach that remembers your goals and habits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Msg = { id: string; role: string; content: string; created_at: string };

function ChatPage() {
  const qc = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const chatFn = useServerFn(coachChat);

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", "chat"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("kind", "chat")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["coach_messages", sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coach_messages")
        .select("*")
        .eq("session_id", sessionId!)
        .order("created_at");
      if (error) throw error;
      return data as Msg[];
    },
  });

  useEffect(() => {
    if (!sessionId && sessions.length) setSessionId(sessions[0].id);
  }, [sessions, sessionId]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, sending]);

  async function ensureSession(firstMessage: string) {
    if (sessionId) return sessionId;
    const { data: u } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("sessions")
      .insert({ user_id: u.user!.id, kind: "chat", title: firstMessage.slice(0, 60) })
      .select()
      .single();
    if (error) throw error;
    setSessionId(data.id);
    qc.invalidateQueries({ queryKey: ["sessions", "chat"] });
    return data.id as string;
  }

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    try {
      const sid = await ensureSession(text);
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user!.id;

      await supabase.from("coach_messages").insert({ user_id: uid, session_id: sid, role: "user", content: text });
      qc.invalidateQueries({ queryKey: ["coach_messages", sid] });

      const [goals, habits] = await Promise.all([
        supabase.from("goals").select("title,category,progress,status").limit(10),
        supabase.from("habits").select("name,target_per_week").limit(10),
      ]);

      const history = [...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })), {
        role: "user" as const,
        content: text,
      }].slice(-20);

      const { reply } = await chatFn({
        data: {
          messages: history,
          context: `Goals: ${JSON.stringify(goals.data ?? [])}. Habits: ${JSON.stringify(habits.data ?? [])}.`,
        },
      });

      await supabase
        .from("coach_messages")
        .insert({ user_id: uid, session_id: sid, role: "assistant", content: reply });
      await supabase.from("sessions").update({ summary: reply.slice(0, 200) }).eq("id", sid);
      qc.invalidateQueries({ queryKey: ["coach_messages", sid] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The coach is unavailable right now");
    } finally {
      setSending(false);
    }
  }

  return (
    <AppShell
      eyebrow="§ MODULE 07"
      title="Conversational Coach"
      actions={
        <button
          onClick={() => setSessionId(null)}
          className="border border-foreground/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition hover:bg-foreground hover:text-background"
        >
          New session
        </button>
      }
    >
      <div className="grid grid-cols-12 gap-2 md:gap-3">
        <div className="panel col-span-12 px-4 py-5 md:col-span-3">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">SESSIONS</p>
          <ul className="mt-3 space-y-1">
            {sessions.length === 0 && (
              <li className="text-[12px] text-muted-foreground">No sessions yet.</li>
            )}
            {sessions.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setSessionId(s.id)}
                  className={`w-full truncate border px-3 py-2 text-left text-[12px] ${
                    sessionId === s.id ? "ink-block border-foreground" : "border-transparent hover:border-foreground/40"
                  }`}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel col-span-12 flex min-h-[70vh] flex-col px-5 py-5 md:col-span-9">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 && !sending && (
              <p className="font-display text-2xl italic text-muted-foreground">
                Ask anything — study plans, career moves, training blocks, motivation.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[80%] whitespace-pre-wrap px-4 py-3 text-[14px] leading-relaxed ${
                  m.role === "user" ? "ink-block ml-auto" : "border border-foreground/25"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Coach is thinking…
              </div>
            )}
            <div ref={bottom} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="mt-4 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 border border-foreground/70 bg-transparent px-4 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="ink-block grid w-14 place-items-center disabled:opacity-60"
              aria-label="Send message"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
