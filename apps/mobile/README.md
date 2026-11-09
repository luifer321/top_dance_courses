# @top-dance/mobile

Expo (SDK 58) app with Expo Router and native tabs: Home, Courses, Profile.

```bash
pnpm dev:mobile                          # from the repo root (builds the api-client first)
pnpm --filter @top-dance/mobile ios      # or: android
pnpm --filter @top-dance/mobile lint | typecheck | test
pnpm --filter @top-dance/mobile build    # expo export for iOS + Android (bundle check)
pnpm --filter @top-dance/mobile doctor   # expo-doctor
```

Environment: copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_API_URL`.

## Layout

- `src/app` — routes (Expo Router)
- `src/i18n` — i18next setup, `locales/{es,en}.json` (keys shared with the web app)
- `src/theme/tokens.ts` — design tokens (same palette as the web, enforced by a test)
- `src/components/ui.tsx` — React Native primitives (web UI components are not shared)
- `src/lib/api.ts` — preconfigured `@top-dance/api-client`

The language is the saved choice, then the device language, then Spanish; it can be
changed in Profile. Metro works with the pnpm workspace without a custom `metro.config.js`.
