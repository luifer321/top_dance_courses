import { describe, expect, it } from "vitest";
import { createLoginSchema } from "./validation";

const t = (key: string, values?: Record<string, number>) =>
  values ? `${key}:${JSON.stringify(values)}` : key;

describe("createLoginSchema", () => {
  const schema = createLoginSchema(t);

  it("accepts valid credentials", () => {
    expect(schema.safeParse({ email: "ana@example.com", password: "123456789012" }).success).toBe(true);
  });

  it("returns translated messages", () => {
    const result = schema.safeParse({ email: "not-an-email", password: "short" });
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((issue) => issue.message);
    expect(messages).toContain("email");
    expect(messages).toContain('minLength:{"min":12}');
  });

  it("requires both fields", () => {
    const result = schema.safeParse({ email: "", password: "" });
    expect(result.error!.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining(["required"]),
    );
  });
});
