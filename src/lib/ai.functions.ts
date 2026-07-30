import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { callAI, extractJson } from "./ai.server";

const chatSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(8000) }))
    .min(1)
    .max(40),
  context: z.string().max(4000).optional(),
});

export const coachChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => chatSchema.parse(d))
  .handler(async ({ data }) => {
    const reply = await callAI([
      {
        role: "system",
        content: `You are CoachMe AI, a warm, sharp personal coach covering academics, career, fitness, sports, habits and productivity.
Give specific, actionable guidance. Use short paragraphs and bullet lists. Never invent user data.
User context: ${data.context ?? "none provided"}`,
      },
      ...data.messages,
    ]);
    return { reply };
  });

const visionSchema = z.object({
  imageDataUrl: z.string().startsWith("data:image/").max(8_000_000),
  prompt: z.string().max(1000).optional(),
});

export const analyzeImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => visionSchema.parse(d))
  .handler(async ({ data }) => {
    const raw = await callAI([
      {
        role: "system",
        content: `You are CoachMe AI Vision. Analyse the image (study notes, workout form, meal, schedule, whiteboard, document) and coach the user.
Respond ONLY with JSON: {"title": string, "analysis": string, "suggestions": string[]} with 3-6 suggestions.`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: data.prompt || "Analyse this image and coach me on it." },
          { type: "image_url", image_url: { url: data.imageDataUrl } },
        ],
      },
    ]);
    return extractJson<{ title: string; analysis: string; suggestions: string[] }>(raw, {
      title: "Vision analysis",
      analysis: raw,
      suggestions: [],
    });
  });

const planSchema = z.object({
  goal: z.string().min(2).max(500),
  date: z.string().max(40),
  notes: z.string().max(1000).optional(),
});

export const generatePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => planSchema.parse(d))
  .handler(async ({ data }) => {
    const raw = await callAI([
      {
        role: "system",
        content: `You build realistic daily schedules. Respond ONLY with JSON array of 4-8 tasks:
[{"title": string, "start_time": "HH:MM", "duration_minutes": number, "priority": "low"|"medium"|"high", "notes": string}]`,
      },
      {
        role: "user",
        content: `Plan my day (${data.date}) around: ${data.goal}. Extra notes: ${data.notes ?? "none"}`,
      },
    ]);
    return extractJson<
      Array<{
        title: string;
        start_time: string;
        duration_minutes: number;
        priority: string;
        notes: string;
      }>
    >(raw, []);
  });

const reportSchema = z.object({ stats: z.string().max(4000) });

export const generateReportInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => reportSchema.parse(d))
  .handler(async ({ data }) => {
    const raw = await callAI([
      {
        role: "system",
        content: `You are a performance coach writing a weekly review. Respond ONLY with JSON:
{"commentary": string, "recommendations": string[]} — commentary 3-5 sentences, 3-5 recommendations.`,
      },
      { role: "user", content: `This week's data: ${data.stats}` },
    ]);
    return extractJson<{ commentary: string; recommendations: string[] }>(raw, {
      commentary: raw,
      recommendations: [],
    });
  });

const recSchema = z.object({ profile: z.string().max(3000) });

export const generateRecommendations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => recSchema.parse(d))
  .handler(async ({ data }) => {
    const raw = await callAI([
      {
        role: "system",
        content: `You are a career matching engine. Respond ONLY with a JSON array of 8-12 items:
[{"kind": "course"|"internship"|"project"|"skill"|"scholarship", "title": string, "description": string, "provider": string, "url": string}]
Use real, well-known providers and plausible public URLs.`,
      },
      { role: "user", content: `Match opportunities for this person: ${data.profile}` },
    ]);
    return extractJson<
      Array<{ kind: string; title: string; description: string; provider: string; url: string }>
    >(raw, []);
  });
