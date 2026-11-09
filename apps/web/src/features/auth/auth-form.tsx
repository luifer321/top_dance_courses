"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Controller, useForm, type FieldValues, type Path } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { api, ensureCsrf } from "@/lib/api";
import { apiErrorMessage } from "@/lib/api-error";
import { createLoginSchema, createRegisterSchema } from "@/lib/validation";
import { GoogleSignInButton } from "./google-sign-in";
import { useInvalidateMe } from "./use-me";

type FieldConfig = {
  name: "name" | "email" | "password";
  type: string;
  autoComplete: string;
};

const LOGIN_FIELDS: FieldConfig[] = [
  { name: "email", type: "email", autoComplete: "email" },
  { name: "password", type: "password", autoComplete: "current-password" },
];

const REGISTER_FIELDS: FieldConfig[] = [
  { name: "name", type: "text", autoComplete: "name" },
  { name: "email", type: "email", autoComplete: "email" },
  { name: "password", type: "password", autoComplete: "new-password" },
];

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const t = useTranslations("auth");
  const tValidation = useTranslations("validation");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const invalidateMe = useInvalidateMe();
  const [submitting, setSubmitting] = useState(false);

  const schema = useMemo(
    () => (mode === "login" ? createLoginSchema(tValidation) : createRegisterSchema(tValidation)),
    [mode, tValidation],
  );
  const fields = mode === "login" ? LOGIN_FIELDS : REGISTER_FIELDS;

  type Values = z.infer<typeof schema> & FieldValues;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(fields.map((f) => [f.name, ""])) as Values,
  });

  async function onSubmit(values: Values) {
    setSubmitting(true);
    try {
      await ensureCsrf();
      const result =
        mode === "login"
          ? await api.POST("/api/v1/auth/login", { body: { email: values.email, password: values.password } })
          : await api.POST("/api/v1/auth/register", {
              body: { name: values.name, email: values.email, password: values.password },
            });
      if (result.error) {
        toast.error(apiErrorMessage(result.error, tErrors("generic")));
        return;
      }
      await ensureCsrf();
      await invalidateMe();
      router.replace("/dashboard");
    } catch {
      toast.error(tErrors("network"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {fields.map(({ name, type, autoComplete }) => (
            <Controller
              key={name}
              name={name as Path<Values>}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`auth-${name}`}>{t(name)}</FieldLabel>
                  <Input
                    {...field}
                    id={`auth-${name}`}
                    type={type}
                    autoComplete={autoComplete}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          ))}
          {mode === "login" && (
            <p className="text-sm">
              <Link href="/forgot-password" className="text-muted-foreground underline-offset-4 hover:underline">
                {t("forgotPassword")}
              </Link>
            </p>
          )}
          <Button type="submit" size="lg" className="mt-1 w-full" disabled={submitting}>
            {mode === "login" ? t("submitLogin") : t("submitRegister")}
          </Button>
        </FieldGroup>
      </form>
      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {t("or")}
        <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleSignInButton />
    </div>
  );
}
