import { ChevronDownIcon, InfoIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { palette, semanticTokens, statusTokens } from "@/design-system/tokens";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";

const BUTTON_VARIANTS = ["default", "secondary", "outline", "ghost", "link", "destructive"] as const;
const STYLE_OPTIONS = ["salsa", "bachata", "choreography"] as const;
const TABS = ["overview", "lessons", "resources"] as const;
const STATUS_CLASSES = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
} as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t py-10">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({ name, color, value }: { name: string; color: string; value?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-16 rounded-lg border" style={{ background: color }} />
      <div className="text-sm">
        <div className="font-mono text-foreground">--{name}</div>
        {value && <div className="font-mono text-xs text-muted-foreground">{value}</div>}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "designSystem" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

export async function DesignSystemPage({ params }: LocalePageProps) {
  await enablePageLocale(params);
  const t = await getTranslations("designSystem");
  const tStyles = await getTranslations("home.styles");
  const tAuth = await getTranslations("auth");

  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />

      <Section title={t("palette")}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          {Object.entries(palette).map(([name, value]) => (
            <Swatch key={name} name={name} color={`var(--${name})`} value={value} />
          ))}
        </div>
        <h3 className="pt-4 text-lg font-semibold">{t("semanticTokens")}</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {semanticTokens.map((name) => (
            <Swatch key={name} name={name} color={`var(--${name})`} />
          ))}
        </div>
        <h3 className="pt-4 text-lg font-semibold">{t("statusColors")}</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statusTokens.map((name) => (
            <Swatch key={name} name={name} color={`var(--${name})`} />
          ))}
        </div>
      </Section>

      <Section title={t("typography")}>
        <p className="text-5xl font-semibold tracking-tight text-brand-gradient">{t("headingSample")}</p>
        <h1 className="text-4xl font-semibold">{t("headingSample")}</h1>
        <h2 className="text-3xl font-semibold">{t("headingSample")}</h2>
        <h3 className="text-2xl font-semibold">{t("headingSample")}</h3>
        <p className="max-w-2xl text-base">{t("bodySample")}</p>
        <p className="max-w-2xl text-sm text-muted-foreground">{t("bodySample")}</p>
      </Section>

      <Section title={t("buttons")}>
        <div className="flex flex-wrap items-center gap-3">
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {t(`variants.${variant}`)}
            </Button>
          ))}
          <Button disabled>{t("variants.disabled")}</Button>
          <Button className="bg-brand-gradient shadow-glow">{t("variants.default")}</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">{t("variants.default")}</Button>
          <Button>{t("variants.default")}</Button>
          <Button size="lg">{t("variants.default")}</Button>
        </div>
      </Section>

      <Section title={t("forms")}>
        <FieldGroup className="max-w-md">
          <Field>
            <FieldLabel htmlFor="ds-email">{tAuth("email")}</FieldLabel>
            <Input id="ds-email" type="email" placeholder={t("emailPlaceholder")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="ds-style">{t("selectPlaceholder")}</FieldLabel>
            <Select>
              <SelectTrigger id="ds-style" className="w-full">
                <SelectValue placeholder={t("selectPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {STYLE_OPTIONS.map((style) => (
                  <SelectItem key={style} value={style}>
                    {tStyles(style)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="ds-comment">{t("textareaPlaceholder")}</FieldLabel>
            <Textarea id="ds-comment" placeholder={t("textareaPlaceholder")} aria-invalid />
          </Field>
        </FieldGroup>
      </Section>

      <Section title={t("cards")}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="transition-colors hover:bg-card-hover">
            <CardHeader>
              <CardTitle>{t("cardTitle")}</CardTitle>
              <CardDescription>{t("cardDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>{t("badgeLevels.beginner")}</Badge>
              <Badge variant="outline">ES</Badge>
              <Badge variant="outline">EN</Badge>
            </CardContent>
            <CardFooter>
              <Button size="sm">{t("variants.default")}</Button>
            </CardFooter>
          </Card>
          <Card className="bg-brand-gradient shadow-glow">
            <CardHeader>
              <CardTitle className="text-white">{t("cardTitle")}</CardTitle>
              <CardDescription className="text-gray-100">{t("cardDescription")}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section title={t("badges")}>
        <div className="flex flex-wrap gap-2">
          <Badge>{t("badgeLevels.beginner")}</Badge>
          <Badge variant="secondary">{t("badgeLevels.intermediate")}</Badge>
          <Badge variant="outline">{t("badgeLevels.advanced")}</Badge>
          <Badge variant="destructive">{t("statuses.error")}</Badge>
          {(Object.keys(STATUS_CLASSES) as (keyof typeof STATUS_CLASSES)[]).map((status) => (
            <Badge key={status} className={STATUS_CLASSES[status]}>
              {t(`statuses.${status}`)}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title={t("dialogs")}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-fit">
              {t("openDialog")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("dialogTitle")}</DialogTitle>
              <DialogDescription>{t("dialogDescription")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button>{t("close")}</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title={t("navigation")}>
        <Tabs defaultValue="overview" className="max-w-xl">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {t(`tabs.${tab}`)}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((tab) => (
            <TabsContent key={tab} value={tab} className="text-muted-foreground">
              {t(`tabs.${tab}`)}: {t("tabContent")}
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                {t("dropdown")}
                <ChevronDownIcon aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {TABS.map((tab) => (
                <DropdownMenuItem key={tab}>{t(`tabs.${tab}`)}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("tooltip")}>
                <InfoIcon aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("tooltip")}</TooltipContent>
          </Tooltip>
        </div>
      </Section>

      <Section title={t("table")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("tableHeaders.lesson")}</TableHead>
              <TableHead>{t("tableHeaders.duration")}</TableHead>
              <TableHead>{t("tableHeaders.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{tStyles("footwork")}</TableCell>
              <TableCell>12:30</TableCell>
              <TableCell>
                <Badge className={STATUS_CLASSES.success}>{t("statuses.success")}</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{tStyles("musicality")}</TableCell>
              <TableCell>08:45</TableCell>
              <TableCell>
                <Badge className={STATUS_CLASSES.warning}>{t("statuses.warning")}</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>

      <Section title={t("surfaces")}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold">{t("darkSurface")}</h3>
            <p className="text-sm text-muted-foreground">{t("bodySample")}</p>
            <Button className="w-fit">{t("variants.default")}</Button>
          </div>
          <div className="surface-light flex flex-col gap-3 rounded-xl border p-6">
            <h3 className="text-lg font-semibold">{t("lightSurface")}</h3>
            <p className="text-sm text-muted-foreground">{t("bodySample")}</p>
            <Button className="w-fit">{t("variants.default")}</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
