"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Square, Mic, Pause } from "@/components/icons";
import { getTemplate } from "@/lib/templates";

const BARS = 40;

// Minimal Web Speech API typings (not part of the standard TS DOM lib).
interface SpeechResultAlternative {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechResultAlternative;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;
interface VoiceWindow {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
  webkitAudioContext?: typeof AudioContext;
}

export function Recorder({ templateId }: { templateId: string }) {
  const router = useRouter();
  const tpl = getTemplate(templateId);

  const [status, setStatus] = useState<"idle" | "recording" | "stopped">("idle");
  const [seconds, setSeconds] = useState(0);
  const [finalText, setFinalText] = useState("");
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(true);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    recognitionRef.current?.stop?.();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const drawWaveform = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const step = Math.floor(data.length / BARS);
      for (let i = 0; i < BARS; i++) {
        const v = data[i * step] / 255; // 0..1
        const el = barsRef.current[i];
        if (el) el.style.transform = `scaleY(${Math.max(0.12, v)})`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Live waveform via Web Audio analyser
      const Ctx =
        window.AudioContext || (window as unknown as VoiceWindow).webkitAudioContext!;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;
      drawWaveform();

      // Live transcription via Web Speech API (Chrome/Edge/Safari)
      const w = window as unknown as VoiceWindow;
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (SR) {
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-AU";
        rec.onresult = (e: SpeechRecognitionEventLike) => {
          let fin = "";
          let int = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const r = e.results[i];
            if (r.isFinal) fin += r[0].transcript;
            else int += r[0].transcript;
          }
          if (fin) setFinalText((p) => (p + " " + fin).trim());
          setInterim(int);
        };
        rec.onerror = () => {};
        rec.start();
        recognitionRef.current = rec;
      } else {
        setSupported(false);
      }

      setStatus("recording");
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setSupported(false);
    }
  }, [drawWaveform]);

  const stop = useCallback(() => {
    cleanup();
    setStatus("stopped");
    const transcript = (finalText + " " + interim).trim();
    sessionStorage.setItem(
      "vd:capture",
      JSON.stringify({ templateId, transcript, seconds })
    );
    router.push(`/preview?template=${templateId}`);
  }, [cleanup, finalText, interim, seconds, templateId, router]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-night text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6">
        <button
          onClick={() => {
            cleanup();
            router.push("/templates");
          }}
          className="flex items-center gap-1 text-sm text-white/50"
        >
          <X className="size-4" /> Cancel
        </button>
        <span className="flex items-center gap-1.5 rounded-lg bg-brand-light/15 px-3 py-1.5 text-xs font-semibold text-brand-light">
          <tpl.icon className="size-3.5" /> {tpl.name}
        </span>
      </div>

      {/* Center */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {/* Waveform */}
        <div className="mb-8 flex h-20 items-center gap-[3px]">
          {Array.from({ length: BARS }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                barsRef.current[i] = el;
              }}
              className="w-[3px] origin-center rounded-full bg-gradient-to-b from-brand to-brand-light transition-transform duration-75"
              style={{
                height: 56,
                transform: "scaleY(0.12)",
                opacity: status === "recording" ? 0.9 : 0.3,
              }}
            />
          ))}
        </div>

        {/* Record / stop button */}
        {status === "recording" ? (
          <button
            onClick={stop}
            aria-label="Stop recording"
            className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-danger to-red-600 shadow-[0_0_0_8px_rgba(239,68,68,0.12),0_0_0_16px_rgba(239,68,68,0.06)]"
          >
            <Square className="size-7 fill-white text-white" />
          </button>
        ) : (
          <button
            onClick={start}
            aria-label="Start recording"
            className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-light shadow-[0_0_0_8px_rgba(108,60,225,0.15)]"
          >
            <Mic className="size-9 text-white" />
          </button>
        )}

        <p className="mt-5 font-mono text-4xl font-extrabold tracking-widest">
          {mm}:{ss}
        </p>
        <p className="mt-1.5 text-sm text-white/35">
          {status === "recording" ? "Recording… tap to stop" : "Tap the mic to start"}
        </p>

        {/* Live transcription */}
        <div className="mt-6 w-full max-w-lg rounded-2xl bg-white/5 p-4">
          <p className="mb-1.5 text-[10px] font-bold tracking-wide text-brand-light">
            LIVE TRANSCRIPTION
          </p>
          {!supported ? (
            <p className="text-xs leading-relaxed text-white/50">
              Live transcription isn’t supported in this browser, but your audio is still
              being recorded and will be transcribed after you stop. (Best in Chrome,
              Edge or Safari.)
            </p>
          ) : finalText || interim ? (
            <p className="text-sm leading-relaxed text-white/70">
              {finalText}{" "}
              <span className="text-brand-light/80">{interim}</span>
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-white/30">
              {status === "recording"
                ? "Start speaking — your words will appear here…"
                : "e.g. “Kitchen reno for John Smith, 3 days labour at $85/hour, tiles $420…”"}
            </p>
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="flex justify-center gap-4 px-6 pb-10">
        <span className="flex size-12 items-center justify-center rounded-full bg-white/5 text-white/40">
          <Pause className="size-5" />
        </span>
      </div>
    </div>
  );
}
