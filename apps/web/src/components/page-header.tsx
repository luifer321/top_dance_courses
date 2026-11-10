import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 pb-5">
      <h1 className="text-2xl tracking-tight sm:text-3xl">{title}</h1>
      {description && <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>}
      {children}
    </div>
  );
}
