import { z } from "zod";

// Client-side validation is a UX aid only; Rails is the source of truth.
type ValidationT = (
  key: "required" | "email" | "minLength" | "maxLength",
  values?: Record<string, number>,
) => string;

export const PASSWORD_MIN_LENGTH = 8;

export function emailField(t: ValidationT) {
  return z.string().trim().min(1, t("required")).pipe(z.email(t("email")));
}

export function passwordField(t: ValidationT) {
  return z
    .string()
    .min(1, t("required"))
    .min(PASSWORD_MIN_LENGTH, t("minLength", { min: PASSWORD_MIN_LENGTH }))
    .max(128, t("maxLength", { max: 128 }));
}

export function createLoginSchema(t: ValidationT) {
  return z.object({ email: emailField(t), password: passwordField(t) });
}

export function createRegisterSchema(t: ValidationT) {
  return z.object({
    name: z.string().trim().min(1, t("required")).max(100, t("maxLength", { max: 100 })),
    email: emailField(t),
    password: passwordField(t),
  });
}
