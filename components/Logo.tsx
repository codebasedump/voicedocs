import { Mic } from "@/components/icons";

export function Logo({
  size = "md",
  light = false,
}: {
  size?: "sm" | "md" | "lg";
  light?: boolean;
}) {
  const text =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  const box = size === "lg" ? "size-9" : size === "sm" ? "size-6" : "size-7";
  return (
    <span className={`inline-flex items-center gap-2 font-serif ${text}`}>
      <span
        className={`inline-flex ${box} items-center justify-center rounded-[10px] bg-brand text-white`}
      >
        <Mic className="size-[55%]" strokeWidth={2.5} />
      </span>
      <span className={light ? "text-white" : "text-ink"}>
        Voice<span className="text-brand-light">Docs</span>
      </span>
    </span>
  );
}
