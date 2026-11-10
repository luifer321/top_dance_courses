import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function BrandLockup({ label, size = "md" }: { label: string; size?: "sm" | "md" }) {
  return (
    <Link
      href="/"
      aria-label={label}
      className={cn("inline-flex items-center gap-2", size === "sm" && "logo-lockup-sm")}
    >
      {/* Static mark; next/image is unoptimized under `output: "export"`. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/mark.png" alt="" width={1024} height={918} className={size === "sm" ? "h-6 w-auto" : "h-8 w-auto"} />
      <span className="flex items-center gap-1.5 leading-none">
        <span className="logo-top">TOP</span>
        <span className="logo-dance">DANCE</span>
      </span>
    </Link>
  );
}
