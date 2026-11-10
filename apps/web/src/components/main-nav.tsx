"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/courses", label: "courses" },
  { href: "/dashboard", label: "dashboard" },
] as const;

function isActive(pathname: string, href: (typeof LINKS)[number]["href"]) {
  if (href === "/dashboard") return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  return (
    pathname === "/courses" ||
    pathname.startsWith("/courses/") ||
    pathname === "/cursos" ||
    pathname.startsWith("/cursos/")
  );
}

export function MainNav({ className }: { className?: string }) {
  const t = useTranslations("navigation");
  const pathname = usePathname();

  return (
    <nav aria-label={t("mainMenu")} className={cn("items-center gap-1", className)}>
      {LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1 text-sm transition-colors",
              active ? "bg-white/8 text-white" : "text-muted-foreground hover:text-white",
            )}
          >
            {t(link.label)}
          </Link>
        );
      })}
    </nav>
  );
}
