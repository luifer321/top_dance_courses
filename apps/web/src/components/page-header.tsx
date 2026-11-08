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
    <div className="flex flex-col gap-2 pb-8">
      <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
      {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}
