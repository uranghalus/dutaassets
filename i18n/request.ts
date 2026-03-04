import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const LOCALE_COOKIE = "pref_language";
const DEFAULT_LOCALE = "id";
const SUPPORTED_LOCALES = ["id", "en", "en-gb"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function normalizeLocale(raw: string | undefined): Locale {
  if (!raw) return DEFAULT_LOCALE;
  // en-gb uses the same English messages as en
  const normalized = raw.toLowerCase() as Locale;
  return SUPPORTED_LOCALES.includes(normalized) ? normalized : DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = normalizeLocale(raw);

  // en-gb loads the same messages as en
  const messageLocale = locale === "en-gb" ? "en" : locale;

  return {
    locale,
    messages: (await import(`../messages/${messageLocale}.json`)).default,
  };
});
