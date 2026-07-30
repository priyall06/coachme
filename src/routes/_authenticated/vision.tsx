import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { analyzeImage } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/vision")({
  head: () => ({
    meta: [
      { title: "AI Vision — CoachMe AI" },
      { name: "description", content: "Upload notes, form checks or meals and get instant coaching feedback." },
      { property: "og:title", content: "AI Vision — CoachMe AI" },
      { property: "og:description", content: "Image analysis coaching for notes, workouts and documents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VisionPage,
});

function VisionPage() {
  const qc = useQueryClient();
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const visionFn = useServerFn(analyzeImage);

  const { data: reports = [] } = useQuery({
    queryKey: ["vision_reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vision_reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const run = useMutation({
    mutationFn: async () => {
      if (!file || !preview) throw new Error("Choose an image first");
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user!.id;
      const path = `${uid}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const up = await supabase.storage.from("vision-uploads").upload(path, file);
      if (up.error) throw up.error;

      const result = await visionFn({ data: { imageDataUrl: preview, prompt: prompt || undefined } });
      const { error } = await supabase.from("vision_reports").insert({
        user_id: uid,
        title: result.title || "Vision analysis",
        analysis: result.analysis,
        suggestions: result.suggestions ?? [],
        prompt: prompt || null,
        image_path: path,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Analysis complete");
      setFile(null);
      setPreview(null);
      setPrompt("");
      qc.invalidateQueries({ queryKey: ["vision_reports"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Analysis failed"),
  });

  function onPick(f: File | undefined) {
    if (!f) return;
    if (f.size > 5_000_000) return toast.error("Image must be under 5 MB");
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(f);
  }

  return (
    <AppShell eyebrow="§ MODULE 05" title="AI Vision">
      <div className="grid grid-cols-12 gap-2 md:gap-3">
        <div className="panel col-span-12 space-y-3 px-5 py-6 md:col-span-5">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">UPLOAD</p>
          <label className="grid cursor-pointer place-items-center border border-dashed border-foreground/60 px-4 py-10 text-center">
            {preview ? (
              <img src={preview} alt="Selected upload preview" className="max-h-56 w-auto object-contain" />
            ) : (
              <span className="flex flex-col items-center gap-2 text-[12px] text-muted-foreground">
                <Upload className="h-5 w-5" /> Choose an image
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPick(e.target.files?.[0])}
            />
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="What should the coach look at?"
            className="w-full border border-foreground/70 bg-transparent px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={() => run.mutate()}
            disabled={run.isPending}
            className="ink-block flex w-full items-center justify-center gap-2 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-60"
          >
            {run.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Analyse
          </button>
        </div>

        <div className="col-span-12 space-y-2 md:col-span-7 md:space-y-3">
          {reports.length === 0 && (
            <div className="panel px-5 py-8 text-sm text-muted-foreground">No analyses yet.</div>
          )}
          {reports.map((r) => (
            <div key={r.id} className="panel px-5 py-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {new Date(r.created_at).toLocaleString()}
              </span>
              <h3 className="mt-1 font-display text-2xl leading-tight">{r.title}</h3>
              <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed">{r.analysis}</p>
              {r.suggestions?.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px]">
                  {r.suggestions.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
