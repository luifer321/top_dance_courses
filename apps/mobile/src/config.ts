export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001",
  googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
} as const;
