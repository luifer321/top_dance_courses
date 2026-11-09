// Development-only route: the ".dev.tsx" page extension is only registered by
// next.config.ts in `next dev` or when NEXT_PUBLIC_ENABLE_DESIGN_SYSTEM=true.
export { DesignSystemPage as default, generateMetadata } from "@/features/design-system/design-system-page";
