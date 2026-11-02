import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n";
export function proxy(request: NextRequest) {
  const saved = request.cookies.get("portfolio-locale")?.value;
  const preferences = (request.headers.get("accept-language") || "en")
    .split(",")
    .map((part, index) => {
      const [tag, quality] = part.trim().split(";q=");
      return {
        tag: tag.toLowerCase().split("-")[0],
        quality: quality ? Number(quality) : 1,
        index,
      };
    })
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  const locale =
    saved && isLocale(saved)
      ? saved
      : preferences.find((p) => isLocale(p.tag) && p.quality > 0)?.tag || "en";
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}
export const config = { matcher: ["/", "/projects/:path*"] };
