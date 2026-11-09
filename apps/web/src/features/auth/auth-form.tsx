"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Controller, useForm, type FieldValues, type Path } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createLoginSchema, createRegisterSchema } from "@/lib/validation";

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

  // Authentication flows are implemented in Rails later; nothing is sent yet.
  function onSubmit() {
    toast.info(t("notAvailableYet"));
  }

  return (
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
        <Button type="submit" size="lg" className="mt-1 w-full">
          {mode === "login" ? t("submitLogin") : t("submitRegister")}
        </Button>
      </FieldGroup>
    </form>
  );
}
