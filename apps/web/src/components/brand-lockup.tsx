import { Link } from "@/i18n/navigation";

export function BrandLockup({ label }: { label: string }) {
  return (
    <Link href="/" aria-label={label} className="inline-flex items-center gap-2.5">
      {/* Static mark; next/image is unoptimized under `output: "export"`. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/mark.png" alt="" width={1024} height={918} className="h-9 w-auto" />
      <span className="flex items-center gap-1.5 leading-none">
        <span className="logo-top">TOP</span>
        <span className="logo-dance">DANCE</span>
      </span>
    </Link>
  );
}
