import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type TextInputProps,
  type TextProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, spacing, typography } from "@/theme/tokens";

// Native primitives styled with the shared Top Dance tokens. These are React
// Native components; web (shadcn/ui) components are never shared with mobile.

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.screenContent}>{children}</ScrollView>
    </SafeAreaView>
  );
}

export function Title({ style, ...props }: TextProps) {
  return <Text accessibilityRole="header" style={[styles.title, style]} {...props} />;
}

export function Heading({ style, ...props }: TextProps) {
  return <Text accessibilityRole="header" style={[styles.heading, style]} {...props} />;
}

export function Body({ muted, style, ...props }: TextProps & { muted?: boolean }) {
  return <Text style={[styles.body, muted && styles.muted, style]} {...props} />;
}

export function Eyebrow({ style, ...props }: TextProps) {
  return <Text style={[styles.eyebrow, style]} {...props} />;
}

export function Card({ children, flush }: { children: ReactNode; flush?: boolean }) {
  return <View style={[styles.card, flush && styles.cardFlush]}>{children}</View>;
}

export function Badge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

export function Button({
  label,
  variant = "default",
  ...props
}: PressableProps & { label: string; variant?: "default" | "outline" }) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        variant === "outline" && styles.buttonOutline,
        pressed && styles.buttonPressed,
      ]}
      {...props}
    >
      <Text style={[styles.buttonText, variant === "outline" && styles.buttonOutlineText]}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        style={styles.input}
        autoCapitalize="none"
        {...props}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  screenContent: { padding: spacing.xl, gap: spacing.lg },
  title: { ...typography.display, color: colors.heading },
  heading: { ...typography.heading, color: colors.heading },
  body: { ...typography.body, color: colors.foreground },
  muted: { color: colors.mutedForeground },
  eyebrow: {
    ...typography.caption,
    color: colors.accentForeground,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: "hidden",
  },
  cardFlush: { padding: 0, gap: 0 },
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  badgeText: { ...typography.caption, color: colors.secondaryForeground },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    shadowColor: colors.info,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { ...typography.body, fontWeight: "600", color: colors.primaryForeground },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
  },
  buttonOutlineText: { color: colors.foreground },
  field: { gap: spacing.xs },
  fieldLabel: { ...typography.caption, color: colors.mutedForeground },
  input: {
    ...typography.body,
    color: colors.foreground,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  fieldError: { ...typography.caption, color: colors.destructive },
});
