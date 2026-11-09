"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { api, ensureCsrf } from "@/lib/api";
import { apiErrorMessage } from "@/lib/api-error";
import { emailField, passwordField } from "@/lib/validation";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tValidation = useTranslations("validation");
  const tErrors = useTranslations("errors");
  const [submitting, setSubmitting] = useState(false);
  const schema = useMemo(() => z.object({ email: emailField(tValidation) }), [tValidation]);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  async function onSubmit(values: { email: string }) {
    setSubmitting(true);
    try {
      await ensureCsrf();
      const { error } = await api.POST("/api/v1/auth/password", { body: values });
      if (error) {
        toast.error(apiErrorMessage(error, tErrors("generic")));
        return;
      }
      toast.success(t("resetEmailSent"));
    } catch {
      toast.error(tErrors("network"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="auth-email">{t("email")}</FieldLabel>
              <Input {...field} id="auth-email" type="email" autoComplete="email" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" size="lg" className="mt-1 w-full" disabled={submitting}>
          {t("submitForgot")}
        </Button>
      </FieldGroup>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations("auth");
  const tValidation = useTranslations("validation");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const schema = useMemo(() => z.object({ password: passwordField(tValidation) }), [tValidation]);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { password: "" } });

  async function onSubmit(values: { password: string }) {
    setSubmitting(true);
    try {
      await ensureCsrf();
      const { error } = await api.POST("/api/v1/auth/password/reset", { body: { token, password: values.password } });
      if (error) {
        toast.error(apiErrorMessage(error, tErrors("generic")));
        return;
      }
      toast.success(t("passwordUpdated"));
      router.replace("/login");
    } catch {
      toast.error(tErrors("network"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="auth-password">{t("password")}</FieldLabel>
              <Input
                {...field}
                id="auth-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" size="lg" className="mt-1 w-full" disabled={submitting}>
          {t("submitReset")}
        </Button>
      </FieldGroup>
    </form>
  );
}
