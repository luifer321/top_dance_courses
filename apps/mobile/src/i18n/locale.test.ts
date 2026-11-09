import { DEFAULT_LOCALE, resolveDeviceLocale, resolveLocale } from "./locale";

describe("locale resolution", () => {
  it("defaults to Spanish", () => {
    expect(DEFAULT_LOCALE).toBe("es");
    expect(resolveDeviceLocale([])).toBe("es");
    expect(resolveDeviceLocale([{ languageCode: "de" }])).toBe("es");
  });

  it("uses the first supported device language", () => {
    expect(resolveDeviceLocale([{ languageCode: "fr" }, { languageCode: "en" }])).toBe("en");
    expect(resolveDeviceLocale([{ languageCode: null }, { languageCode: "ES" }])).toBe("es");
  });

  it("prefers a manual selection over the device language", () => {
    expect(resolveLocale("en", [{ languageCode: "es" }])).toBe("en");
    expect(resolveLocale("system", [{ languageCode: "en" }])).toBe("en");
  });
});
