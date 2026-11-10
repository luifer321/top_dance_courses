import { cn } from "@/lib/utils";

export function CatalogCover({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("@container relative overflow-hidden bg-secondary", className)}>
      <div className="absolute inset-0 bg-surface-gradient" />
      {src ? (
        // Static export: next/image is unoptimized, so a plain img is correct.
        <img
          src={src}
          alt={alt}
          className="relative size-full object-cover transition duration-500 ease-out group-hover:scale-[1.02]"
        />
      ) : (
        <div className="relative flex size-full items-center justify-center">
          <span className="text-[22cqw] font-semibold tracking-[0.18em] text-purple-glow/40">TD</span>
        </div>
      )}
    </div>
  );
}
